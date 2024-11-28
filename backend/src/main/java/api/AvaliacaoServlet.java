package api;

import com.google.gson.Gson;
import database.AvaliacaoDAO;
import model.Avaliacao;
import model.Ubs;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class AvaliacaoServlet extends HttpServlet {

    private AvaliacaoDAO avaliacaoDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        avaliacaoDAO = new AvaliacaoDAO();
    }

    // Rota para criar uma avaliação (ID da UBS vem no corpo da requisição)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }

        String jsonBody = sb.toString();
        System.out.println("Corpo da requisição recebido: " + jsonBody);

        // Conversão do JSON para o objeto Avaliacao
        Gson gson = new Gson();
        Avaliacao avaliacao = gson.fromJson(jsonBody, Avaliacao.class);

        try {
            // Insere a avaliação no banco com o ID da UBS já presente no objeto Avaliacao
            int result = avaliacaoDAO.insertAvaliacao(avaliacao);

            if (result > 0) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201 - Criado com sucesso
                response.getWriter().write("{\"status\": \"success\", \"message\": \"Avaliação cadastrada com sucesso!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Requisição ruim
                response.getWriter().write("{\"message\": \"Erro ao cadastrar avaliação!\"}");
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
            response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados!\"}");
            e.printStackTrace(); // Imprime o stack trace no log
        }
    }

    // Rota para consultar as avaliações de uma UBS específica: api/avaliacao/(ID)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo(); // Obtém a parte da URL após "/avaliacao"
        
        try {
            if (pathInfo != null && pathInfo.startsWith("/")) { // Certifica-se que o pathInfo não esteja vazio
                String[] pathParts = pathInfo.split("/"); // Divide a URL em partes

                // Espera-se que a URL tenha o formato "/avaliacao/{id}" onde {id} é o ID da UBS
                if (pathParts.length == 2) {
                    int ubsId = Integer.parseInt(pathParts[1]); // O id da UBS está em pathParts[1]

                    // Recupera as avaliações para o ID da UBS
                    List<Avaliacao> avaliacoes = avaliacaoDAO.getAvaliacoesByUbsId(ubsId);

                    if (avaliacoes != null && !avaliacoes.isEmpty()) {
                        // Calcula a média das notas
                        double media = avaliacaoDAO.calcularMediaNotas(ubsId);

                        // Converte a lista de avaliações para JSON
                        String jsonResponse = new Gson().toJson(avaliacoes);

                        // Envia a resposta com as avaliações e a média
                        response.getWriter().write("{\"avaliacoes\": " + jsonResponse + ", \"media\": " + media + "}");
                    } else {
                        // Caso não haja avaliações, envia uma mensagem informando
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write("{\"message\": \"Nenhuma avaliação encontrada para a UBS.\"}");
                    }
                } else {
                    // Caso o ID da UBS não seja fornecido corretamente
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Bad Request
                    response.getWriter().write("{\"message\": \"Formato da URL inválido!\"}");
                }
            } else {
                // Caso pathInfo seja null ou não contenha o ID da UBS corretamente
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"Formato da URL inválido!\"}");
            }
        } catch (SQLException e) {
            // Erro ao conectar ao banco de dados
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro interno do servidor
            response.getWriter().write("{\"message\": \"Erro ao recuperar as avaliações.\"}");
            e.printStackTrace(); // Imprime o erro no log
        } catch (NumberFormatException e) {
            // Erro ao tentar converter o ID para um número
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - ID inválido
            response.getWriter().write("{\"message\": \"ID de UBS inválido!\"}");
        }
    }
}
