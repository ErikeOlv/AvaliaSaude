package api;

import com.google.gson.Gson;
import database.DBConnection;
import model.Usuario;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Definindo o tipo de resposta para JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Lê o corpo da requisição JSON
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }

        // O corpo da requisição
        String jsonBody = sb.toString();
        System.out.println("Corpo da requisição recebido: " + jsonBody);

        // Usando Gson para converter o JSON em um objeto de solicitação
        Gson gson = new Gson();
        LoginRequest loginRequest = gson.fromJson(jsonBody, LoginRequest.class);

        String email = loginRequest.getEmail();
        String senha = loginRequest.getSenha();

        // Verificando se os parâmetros email e senha foram recebidos corretamente
        if (email == null || senha == null || email.isEmpty() || senha.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            response.getWriter().write("{\"message\":\"Email e senha são obrigatórios!\"}");
            return;
        }

        // Chama o método de autenticação
        Usuario user = autenticarUsuario(email, senha);

        // Se o usuário for autenticado com sucesso
        if (user != null) {
            if (user.isAtivo()) {
                response.setStatus(HttpServletResponse.SC_OK); // 200
                String jsonResponse = gson.toJson(user); // Converte o objeto Usuario em JSON
                response.getWriter().write("{\"status\":\"success\", \"usuario\":" + jsonResponse + "}");
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
                response.getWriter().write("{\"message\":\"Usuário inativo. Entre em contato com o suporte.\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.getWriter().write("{\"message\":\"E-mail ou senha incorretos.\"}");
        }
    }

    private Usuario autenticarUsuario(String email, String senha) {
        try (Connection connection = DBConnection.getConnection()) {
            if (connection == null) {
                System.out.println("Erro na conexão com o banco de dados.");
                return null;
            }

            String query = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
            try (PreparedStatement stmt = connection.prepareStatement(query)) {
                stmt.setString(1, email);
                stmt.setString(2, senha);

                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    System.out.println("Usuário encontrado: " + email);
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    String cpf = rs.getString("cpf");
                    String tipoUsuario = rs.getString("tipo_usuario");
                    String telefone = rs.getString("telefone");
                    char sexo = rs.getString("sexo").charAt(0); // Obtendo o primeiro caractere (M/F/O)
                    Date nascimento = rs.getDate("nascimento");
                    boolean ativo = rs.getBoolean("ativo");

                    // Criando o objeto Usuario com os novos atributos
                    return new Usuario(id, nome, cpf, email, senha, tipoUsuario, telefone, sexo, nascimento, ativo);
                } else {
                    System.out.println("Usuário não encontrado: " + email);
                    return null;
                }
            }
        } catch (SQLException ex) {
            System.out.println("Erro ao autenticar usuário: " + ex.getMessage());
            return null;
        }
    }
}
