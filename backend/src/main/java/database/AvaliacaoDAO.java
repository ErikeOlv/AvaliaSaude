package database;

import model.Avaliacao;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AvaliacaoDAO {

    private Connection connection;

    // Construtor que inicializa a conexão com o banco de dados
    public AvaliacaoDAO() {
        this.connection = DBConnection.getConnection();
    }

    // Insere uma avaliação no banco de dados
    public int insertAvaliacao(Avaliacao avaliacao) throws SQLException {
        String query = "INSERT INTO avaliacoes_ubs (ubs_id, ubs_nome, usuario_id, usuario_nome, nota, comentario, data_avaliacao) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, avaliacao.getUbsId());
            stmt.setString(2, avaliacao.getUbsNome());
            stmt.setInt(3, avaliacao.getUsuarioId());
            stmt.setString(4, avaliacao.getUsuarioNome());
            stmt.setInt(5, avaliacao.getNota());
            stmt.setString(6, avaliacao.getComentario());
            stmt.setTimestamp(7, new Timestamp(System.currentTimeMillis())); // Define o timestamp atual
            return stmt.executeUpdate(); // Retorna o número de linhas afetadas
        }
    }

    // Recupera as avaliações de uma UBS específica pelo ID
    public List<Avaliacao> getAvaliacoesByUbsId(int ubsId) throws SQLException {
        List<Avaliacao> avaliacoes = new ArrayList<>();
        String query = "SELECT * FROM avaliacoes_ubs WHERE ubs_id = ? AND ativo = 1";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, ubsId); // Define o ID da UBS no parâmetro
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Avaliacao avaliacao = new Avaliacao();
                    avaliacao.setId(rs.getInt("id"));
                    avaliacao.setUbsId(rs.getInt("ubs_id"));
                    avaliacao.setUbsNome(rs.getString("ubs_nome"));
                    avaliacao.setUsuarioId(rs.getInt("usuario_id"));
                    avaliacao.setUsuarioNome(rs.getString("usuario_nome"));
                    avaliacao.setNota(rs.getInt("nota"));
                    avaliacao.setComentario(rs.getString("comentario"));
                    avaliacao.setDataAvaliacao(rs.getTimestamp("data_avaliacao"));
                    avaliacoes.add(avaliacao); // Adiciona a avaliação à lista
                }
            }
        }
        return avaliacoes; // Retorna a lista de avaliações
    }

    // Calcula a média das notas de avaliações de uma UBS
    public double calcularMediaNotas(int ubsId) throws SQLException {
        String query = "SELECT AVG(nota) AS media FROM avaliacoes_ubs WHERE ubs_id = ? AND ativo = 1";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, ubsId); // Define o ID da UBS no parâmetro
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble("media"); // Retorna a média calculada
                }
            }
        }
        return 0.0; // Retorna 0.0 caso não existam avaliações
    }
}
