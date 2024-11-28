package database;

import model.Ubs;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UbsDAO extends DBQuery {

    public UbsDAO() {
        this.setTableName("ubs"); // Define o nome da tabela
        this.setFieldsName("id, nome, latitude, longitude, logradouro, numero, bairro, cidade, estado, cep, ativo, imagem"); // Define os campos da tabela
        this.setFieldKey("id"); // Define a chave primária
    }

    private Ubs resultSetToUbs(ResultSet rs) throws SQLException {
        int id = rs.getInt("id"); // Obtém o ID
        String nome = rs.getString("nome"); // Obtém o nome
        double latitude = rs.getDouble("latitude"); // Obtém a latitude
        double longitude = rs.getDouble("longitude"); // Obtém a longitude
        String logradouro = rs.getString("logradouro"); // Obtém o logradouro
        String numero = rs.getString("numero"); // Obtém o número (pode ser nulo)
        String bairro = rs.getString("bairro"); // Obtém o bairro
        String cidade = rs.getString("cidade"); // Obtém a cidade
        String estado = rs.getString("estado"); // Obtém o estado
        String cep = rs.getString("cep"); // Obtém o CEP
        boolean ativo = rs.getBoolean("ativo"); // Obtém o status de ativo (true/false)
        String imagem = rs.getString("imagem"); // Obtém a imagem (pode ser nula)

        return new Ubs(id, nome, latitude, longitude, logradouro, numero, bairro, cidade, estado, cep, ativo, imagem); // Retorna o objeto Ubs
    }

    public boolean checkCepExists(String cep) throws SQLException {
        String query = "SELECT 1 FROM " + this.getTableName() + " WHERE cep = ?"; // Verifica se o CEP já existe
        try (PreparedStatement stmt = DBConnection.getConnection().prepareStatement(query)) {
            stmt.setString(1, cep);
            ResultSet rs = stmt.executeQuery();
            return rs.next(); // Retorna true se CEP encontrado
        }
    }

    public List<Ubs> getAllUbs() throws SQLException {
        List<Ubs> ubsList = new ArrayList<>(); // Lista para armazenar as UBS
        ResultSet rs = this.select("ativo = 1"); // Executa a consulta para buscar apenas UBS ativas

        try {
            while (rs.next()) {
                ubsList.add(resultSetToUbs(rs)); // Adiciona a UBS à lista
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar as UBS ativas.", e); // Lança exceção caso ocorra erro
        }

        return ubsList; // Retorna a lista de UBS ativas
    }

    public Ubs getUbsById(int id) throws SQLException {
        ResultSet rs = this.select("id = " + id + " AND ativo = 1"); // Executa a consulta para buscar UBS ativa pelo ID

        try {
            if (rs.next()) {
                return resultSetToUbs(rs); // Retorna a UBS encontrada
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar a UBS com ID: " + id, e); // Lança exceção caso ocorra erro
        }

        return null; // Retorna null se nenhuma UBS for encontrada
    }

    public int insertUbs(Ubs ubs) throws SQLException {
        // Verifica se o CEP já existe
        if (checkCepExists(ubs.getCep())) {
            throw new SQLException("CEP já cadastrado."); // Lança exceção se CEP já existir
        }

        // Tratar valores nulos para numero e imagem
        String numero = (ubs.getNumero() == null || ubs.getNumero().isEmpty()) ? null : ubs.getNumero();
        String imagem = (ubs.getImagem() == null || ubs.getImagem().isEmpty()) ? null : ubs.getImagem();

        // Array de valores a serem inseridos no banco de dados
        String[] values = new String[] {
            ubs.getNome(),
            String.valueOf(ubs.getLatitude()),
            String.valueOf(ubs.getLongitude()),
            ubs.getLogradouro(),
            numero, // Pode ser nulo
            ubs.getBairro(),
            ubs.getCidade(),
            ubs.getEstado(),
            ubs.getCep(),
            "1", // Status ativo
            imagem // Pode ser nulo
        };

        return this.insert(values); // Insere os dados no banco
    }

    public int updateUbs(Ubs ubs) throws SQLException {
        // Verifica se o CEP já existe (excluindo a própria UBS)
        if (checkCepExists(ubs.getCep()) && !ubs.getCep().equals(this.getUbsById(ubs.getId()).getCep())) {
            throw new SQLException("CEP já cadastrado.");
        }

        // Verifica se as coordenadas latitude/longitude foram modificadas
        Ubs oldUbs = this.getUbsById(ubs.getId());
        if ((ubs.getLatitude() != oldUbs.getLatitude() || ubs.getLongitude() != oldUbs.getLongitude()) && 
            getUbsByLatLonNome(ubs.getLatitude(), ubs.getLongitude(), ubs.getNome()) != null) {
            throw new SQLException("Já existe uma UBS com as mesmas coordenadas e nome.");
        }

        // Tratar valores nulos para numero e imagem
        String numero = (ubs.getNumero() == null || ubs.getNumero().isEmpty()) ? null : ubs.getNumero();
        String imagem = (ubs.getImagem() == null || ubs.getImagem().isEmpty()) ? null : ubs.getImagem();

        // Array de valores para atualizar no banco
        String[] values = new String[] {
            String.valueOf(ubs.getId()),  // ID da UBS
            ubs.getNome(),
            String.valueOf(ubs.getLatitude()),
            String.valueOf(ubs.getLongitude()),
            ubs.getLogradouro(),
            numero, // Pode ser nulo
            ubs.getBairro(),
            ubs.getCidade(),
            ubs.getEstado(),
            ubs.getCep(),
            "1", // Status ativo
            imagem // Pode ser nulo
        };

        return this.update(values); // Atualiza os dados no banco
    }

    public int inativarUbs(int id) throws SQLException {
        String[] values = new String[] {
            String.valueOf(id), // ID da UBS
            "0"                 // Status inativo
        };

        String sql = "UPDATE " + this.getTableName() + " SET ativo = " + values[1] + " WHERE " + this.getFieldKey() + " = " + values[0]; // SQL para atualizar o status
        return this.execute(sql); // Executa a query de inativação
    }

    public List<Ubs> getUbsInativas() throws SQLException {
        List<Ubs> ubsList = new ArrayList<>(); // Lista para armazenar as UBS inativas
        ResultSet rs = this.select("ativo = 0"); // Executa a consulta para buscar apenas UBS inativas

        try {
            while (rs.next()) {
                ubsList.add(resultSetToUbs(rs)); // Adiciona as UBS inativas à lista
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar as UBS inativas.", e); // Lança exceção se erro ocorrer
        }

        return ubsList; // Retorna a lista de UBS inativas
    }
    
    public Ubs getUbsByIdInativo(int id) throws SQLException {
        ResultSet rs = this.select("id = " + id + " AND ativo = 0"); // Executa a consulta para buscar UBS inativa pelo ID

        try {
            if (rs.next()) {
                return resultSetToUbs(rs); // Retorna a UBS inativa encontrada
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar a UBS inativa com ID: " + id, e); // Lança exceção caso erro ocorra
        }

        return null; // Retorna null se nenhuma UBS inativa for encontrada
    }

    public int ativarUbs(int id) throws SQLException {
        String[] values = new String[] {
            String.valueOf(id), // ID da UBS
            "1"                 // Status ativo
        };

        String sql = "UPDATE " + this.getTableName() + " SET ativo = " + values[1] + " WHERE " + this.getFieldKey() + " = " + values[0]; // SQL para atualizar o status
        return this.execute(sql); // Executa a query de ativação
    }
    
    public Ubs getUbsByLatLonNome(double latitude, double longitude, String nome) throws SQLException {
        // Consulta SQL para verificar se já existe uma UBS com o mesmo nome, latitude e longitude
        String query = "SELECT * FROM " + this.getTableName() + " WHERE latitude = ? AND longitude = ? AND nome = ? AND ativo = 1";
        
        // Executa a consulta utilizando PreparedStatement para evitar SQL injection
        try (PreparedStatement stmt = DBConnection.getConnection().prepareStatement(query)) {
            stmt.setDouble(1, latitude);
            stmt.setDouble(2, longitude);
            stmt.setString(3, nome);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return resultSetToUbs(rs); // Retorna a UBS se encontrada
            }
        }
        return null; // Retorna null se não encontrar a UBS
    }
}
