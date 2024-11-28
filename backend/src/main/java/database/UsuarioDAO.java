package database;

import model.Usuario;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class UsuarioDAO extends DBQuery {

    public UsuarioDAO() {
        this.setTableName("usuario"); // Define o nome da tabela no banco
        this.setFieldsName("id, nome, cpf, email, senha, tipo_usuario, telefone, sexo, nascimento, ativo"); // Define os campos da tabela
        this.setFieldKey("id"); // Define a chave primária
    }

    // Converte um ResultSet para um objeto Usuario
    private Usuario resultSetToUsuario(ResultSet rs) throws SQLException {
        int id = rs.getInt("id"); // Obtém o ID
        String nome = rs.getString("nome"); // Obtém o nome
        String cpf = rs.getString("cpf"); // Obtém o CPF
        String email = rs.getString("email"); // Obtém o e-mail
        String senha = rs.getString("senha"); // Obtém a senha
        String tipoUsuario = rs.getString("tipo_usuario"); // Obtém o tipo de usuário
        String telefone = rs.getString("telefone"); // Obtém o telefone
        char sexo = rs.getString("sexo").charAt(0); // Obtém o sexo
        Date nascimento = rs.getDate("nascimento"); // Obtém a data de nascimento
        boolean ativo = rs.getBoolean("ativo"); // Obtém o status de ativo (true/false)

        return new Usuario(id, nome, cpf, email, senha, tipoUsuario, telefone, sexo, nascimento, ativo); // Retorna o objeto Usuario
    }

    // Verifica se o CPF já existe no banco
    public boolean checkCpfExists(String cpf) throws SQLException {
        ResultSet rs = this.select("cpf = '" + cpf + "'"); // Executa a consulta para verificar se o CPF existe
        return rs.next(); // Retorna true se CPF encontrado
    }

    // Verifica se o e-mail já existe no banco
    public boolean checkEmailExists(String email) throws SQLException {
        ResultSet rs = this.select("email = '" + email + "'"); // Executa a consulta para verificar se o e-mail existe
        return rs.next(); // Retorna true se e-mail encontrado
    }

    // Verifica se o telefone já existe no banco
    public boolean checkTelefoneExists(String telefone) throws SQLException {
        ResultSet rs = this.select("telefone = '" + telefone + "'"); // Executa a consulta para verificar se o telefone existe
        return rs.next(); // Retorna true se telefone encontrado
    }

    // Obtém todos os usuários ativos
    public List<Usuario> getAllUsuarios() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>(); // Lista para armazenar os usuários
        ResultSet rs = this.select("ativo = 1"); // Executa a consulta para buscar apenas usuários ativos

        try {
            while (rs.next()) {
                usuarios.add(resultSetToUsuario(rs)); // Adiciona o usuário à lista
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar os usuários ativos.", e); // Lança exceção caso ocorra erro
        }

        return usuarios; // Retorna a lista de usuários ativos
    }

    // Obtém um usuário pelo ID
    public Usuario getUsuarioById(int id) throws SQLException {
        ResultSet rs = this.select("id = " + id + " AND ativo = 1"); // Executa a consulta para buscar usuário ativo pelo ID

        try {
            if (rs.next()) {
                return resultSetToUsuario(rs); // Retorna o usuário encontrado
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar o usuário com ID: " + id, e); // Lança exceção caso ocorra erro
        }

        return null; // Retorna null se nenhum usuário for encontrado
    }

    // Insere um novo usuário no banco
    public int insertUsuario(Usuario usuario) throws SQLException {
        // Verifica se CPF, e-mail ou telefone já existem
        if (checkCpfExists(usuario.getCpf())) {
            throw new SQLException("CPF já cadastrado."); // Lança exceção se CPF já existir
        }
        if (checkEmailExists(usuario.getEmail())) {
            throw new SQLException("E-mail já cadastrado."); // Lança exceção se e-mail já existir
        }
        if (checkTelefoneExists(usuario.getTelefone())) {
            throw new SQLException("Telefone já cadastrado."); // Lança exceção se telefone já existir
        }

        // Atribui valor padrão ao tipo_usuario se estiver vazio
        if (usuario.getTipoUsuario() == null || usuario.getTipoUsuario().isEmpty()) {
            usuario.setTipoUsuario("usuario");  // Atribui 'usuario' como valor padrão
        }

        // Converte a data de nascimento para formato SQL
        java.sql.Date dataNascimentoSQL = new java.sql.Date(usuario.getNascimento().getTime());

        // Array de valores a serem inseridos no banco de dados
        String[] values = new String[] {
            usuario.getNome(),
            usuario.getCpf(),
            usuario.getEmail(),
            usuario.getSenha(),
            usuario.getTipoUsuario(),  // Tipo de usuário
            usuario.getTelefone(),
            String.valueOf(usuario.getSexo()),  // Sexo 'M' ou 'F'
            dataNascimentoSQL.toString(),  // Data de nascimento
            "1"  // Status ativo
        };

        return this.insert(values); // Insere os dados no banco
    }

    // Atualiza os dados de um usuário no banco
    public int updateUsuario(Usuario usuario) throws SQLException {
        // Verifica se CPF, e-mail ou telefone já existem (excluindo o próprio usuário)
        if (checkCpfExists(usuario.getCpf()) && !usuario.getCpf().equals(this.getUsuarioById(usuario.getId()).getCpf())) {
            throw new SQLException("CPF já cadastrado.");
        }
        if (checkEmailExists(usuario.getEmail()) && !usuario.getEmail().equals(this.getUsuarioById(usuario.getId()).getEmail())) {
            throw new SQLException("E-mail já cadastrado.");
        }
        if (checkTelefoneExists(usuario.getTelefone()) && !usuario.getTelefone().equals(this.getUsuarioById(usuario.getId()).getTelefone())) {
            throw new SQLException("Telefone já cadastrado.");
        }

        // Converte a data de nascimento para formato SQL
        java.sql.Date dataNascimentoSQL = new java.sql.Date(usuario.getNascimento().getTime());

        // Array de valores para atualizar no banco
        String[] values = new String[] {
            String.valueOf(usuario.getId()),  // ID do usuário
            usuario.getNome(),
            usuario.getCpf(),
            usuario.getEmail(),
            usuario.getSenha(),
            usuario.getTipoUsuario(),
            usuario.getTelefone(),
            String.valueOf(usuario.getSexo()),  // Sexo
            dataNascimentoSQL.toString(),  // Data de nascimento
            "1" // Status ativo durante a atualização
        };

        return this.update(values); // Atualiza os dados no banco
    }

    // Inativa um usuário
    public int inativarUsuario(int id) throws SQLException {
        String[] values = new String[] {
            String.valueOf(id), // ID do usuário
            "0"                 // Status inativo
        };

        String sql = "UPDATE " + this.getTableName() + " SET ativo = " + values[1] + " WHERE " + this.getFieldKey() + " = " + values[0]; // SQL para atualizar o status
        return this.execute(sql); // Executa a query de inativação
    }

    // Obtém todos os usuários inativos
    public List<Usuario> getUsuariosInativos() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>(); // Lista para armazenar os usuários inativos
        ResultSet rs = this.select("ativo = 0"); // Executa a consulta para buscar apenas usuários inativos

        try {
            while (rs.next()) {
                usuarios.add(resultSetToUsuario(rs)); // Adiciona os usuários inativos à lista
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar os usuários inativos.", e); // Lança exceção se erro ocorrer
        }

        return usuarios; // Retorna a lista de usuários inativos
    }
    
    // Obtém um usuário inativo pelo ID
    public Usuario getUsuarioByIdInativo(int id) throws SQLException {
        ResultSet rs = this.select("id = " + id + " AND ativo = 0"); // Executa a consulta para buscar usuário inativo pelo ID

        try {
            if (rs.next()) {
                return resultSetToUsuario(rs); // Retorna o usuário inativo encontrado
            }
        } catch (SQLException e) {
            throw new SQLException("Erro ao recuperar o usuário inativo com ID: " + id, e); // Lança exceção caso erro ocorra
        }

        return null; // Retorna null se nenhum usuário inativo for encontrado
    }

    // Ativa um usuário
    public int ativarUsuario(int id) throws SQLException {
        String[] values = new String[] {
            String.valueOf(id), // ID do usuário
            "1"                 // Status ativo
        };

        String sql = "UPDATE " + this.getTableName() + " SET ativo = " + values[1] + " WHERE " + this.getFieldKey() + " = " + values[0]; // SQL para atualizar o status
        return this.execute(sql); // Executa a query de ativação
    }
}
