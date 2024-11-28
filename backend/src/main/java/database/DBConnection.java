package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Driver;

public class DBConnection {

    public static Connection getConnection() {
        String url = "jdbc:mysql://localhost:3306/avaliasaude";  // Banco 'avaliasaude' na porta padrão 3306
        String user = "root";  // Usuário
        String password = "admin";  // Senha

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");  // Verifique se o driver foi encontrado
            System.out.println("Driver carregado com sucesso");
            Connection connection = DriverManager.getConnection(url, user, password);
            System.out.println("Conexão com o banco estabelecida com sucesso");
            return connection;
        } catch (ClassNotFoundException ex) {
            System.out.println("Driver do banco de dados não localizado");
        } catch (SQLException ex) {
            System.out.println("Erro ao acessar o banco: " + ex.getMessage());
        }
        return null;
    }

    // Método main para testar a conexão
    public static void main(String[] args) {
        // Teste para ver se a conexão foi bem-sucedida
        Connection conexao = null;
        try {
            conexao = getConnection();
            if (conexao != null) {
                System.out.println("Conexão bem-sucedida!");
            } else {
                System.out.println("Falha ao conectar ao banco de dados.");
            }
        } catch (Exception e) {
            System.err.println("Ocorreu um erro: " + e.getMessage());
        }
    }
}
