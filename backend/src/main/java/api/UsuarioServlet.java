package api;

import com.google.gson.Gson;
import database.UsuarioDAO;
import model.Usuario;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class UsuarioServlet extends HttpServlet {

    private UsuarioDAO usuarioDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        usuarioDAO = new UsuarioDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo != null && pathInfo.startsWith("/inativo")) {
                // Verificar se a URL contém um ID para buscar um usuário inativo específico (exemplo: /usuarios/inativo/1)
                String[] pathParts = pathInfo.split("/");

                if (pathParts.length == 3) {
                    // Se houver ID na URL, buscar o usuário inativo pelo ID
                    int id = Integer.parseInt(pathParts[2]);
                    Usuario usuarioInativo = usuarioDAO.getUsuarioByIdInativo(id);

                    if (usuarioInativo != null) {
                        String jsonResponse = new Gson().toJson(usuarioInativo);
                        response.getWriter().write(jsonResponse);
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 - Não encontrado
                        response.getWriter().write("{\"message\": \"Usuário inativo não encontrado.\"}");
                    }
                } else if (pathParts.length == 2) {
                    // Se não houver ID, retornar todos os usuários inativos
                    List<Usuario> usuariosInativos = usuarioDAO.getUsuariosInativos();
                    String jsonResponse = new Gson().toJson(usuariosInativos);
                    response.getWriter().write(jsonResponse);
                }
            } else if (pathInfo != null && pathInfo.split("/").length == 2) {
                // Verificar se a URL contém um ID de usuário para buscar o usuário ativo específico
                int id = Integer.parseInt(pathInfo.split("/")[1]);
                Usuario usuario = usuarioDAO.getUsuarioById(id);

                if (usuario != null) {
                    String jsonResponse = new Gson().toJson(usuario);
                    response.getWriter().write(jsonResponse);
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 - Não encontrado
                    response.getWriter().write("{\"message\": \"Usuário não encontrado.\"}");
                }
            } else {
                // Se não houver ID na URL, retornar todos os usuários
                List<Usuario> usuarios = usuarioDAO.getAllUsuarios();
                String jsonResponse = new Gson().toJson(usuarios);
                response.getWriter().write(jsonResponse);
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            response.getWriter().write("{\"message\": \"Erro ao recuperar os usuários.\"}");
            e.printStackTrace();
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            response.getWriter().write("{\"message\": \"ID inválido!\"}");
        }
    }


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

        Gson gson = new Gson();
        Usuario usuario = gson.fromJson(jsonBody, Usuario.class);

        try {
            // Verificar se o CPF, telefone ou e-mail já existem
            if (usuarioDAO.checkCpfExists(usuario.getCpf())) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"CPF já cadastrado.\"}");
                return;
            }
            if (usuarioDAO.checkEmailExists(usuario.getEmail())) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"E-mail já cadastrado.\"}");
                return;
            }
            if (usuarioDAO.checkTelefoneExists(usuario.getTelefone())) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"Telefone já cadastrado.\"}");
                return;
            }

            int result = usuarioDAO.insertUsuario(usuario);

            if (result > 0) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201 - Criado com sucesso
                response.getWriter().write("{\"status\": \"success\", \"message\": \"Usuário cadastrado com sucesso!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Requisição ruim
                response.getWriter().write("{\"message\": \"Erro ao cadastrar usuário!\"}");
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
            response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados!\"}");
            e.printStackTrace(); // Imprime o stack trace no log
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
            response.getWriter().write("{\"message\": \"Erro desconhecido!\"}");
            e.printStackTrace(); // Imprime o stack trace no log
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo != null) {
            String[] pathParts = pathInfo.split("/");

            // Verifica se a URL segue o formato correto para atualizar: /atualizar/{ID}
            if (pathParts.length == 3 && pathParts[1].equals("atualizar")) {
                try {
                    int id = Integer.parseInt(pathParts[2]); // Extrai o ID da URL

                    // Lê o corpo da requisição
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = request.getReader().readLine()) != null) {
                        sb.append(line);
                    }
                    String jsonBody = sb.toString();
                    System.out.println("Corpo da requisição recebido: " + jsonBody);

                    // Converte o JSON em um objeto Usuario
                    Gson gson = new Gson();
                    Usuario usuario = gson.fromJson(jsonBody, Usuario.class);
                    usuario.setId(id); // Define o ID no objeto

                    // Busca o usuário existente no banco para comparar dados
                    Usuario usuarioExistente = getUsuarioById(id);
                    if (usuarioExistente == null) {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 - Usuário não encontrado
                        response.getWriter().write("{\"message\": \"Usuário não encontrado.\"}");
                        return;
                    }

                    // Validações: CPF, e-mail e telefone já cadastrados
                    if (usuarioDAO.checkCpfExists(usuario.getCpf()) && !usuario.getCpf().equals(usuarioExistente.getCpf())) {
                        response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 - Conflito
                        response.getWriter().write("{\"message\": \"CPF já cadastrado.\"}");
                        return;
                    }
                    if (usuarioDAO.checkEmailExists(usuario.getEmail()) && !usuario.getEmail().equals(usuarioExistente.getEmail())) {
                        response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 - Conflito
                        response.getWriter().write("{\"message\": \"E-mail já cadastrado.\"}");
                        return;
                    }
                    if (usuarioDAO.checkTelefoneExists(usuario.getTelefone()) && !usuario.getTelefone().equals(usuarioExistente.getTelefone())) {
                        response.setStatus(HttpServletResponse.SC_CONFLICT); // 409 - Conflito
                        response.getWriter().write("{\"message\": \"Telefone já cadastrado.\"}");
                        return;
                    }

                    // Atualiza o usuário no banco
                    int result = usuarioDAO.updateUsuario(usuario);
                    if (result > 0) {
                        response.setStatus(HttpServletResponse.SC_OK); // 200 - Sucesso
                        response.getWriter().write("{\"message\": \"Usuário atualizado com sucesso!\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Erro na requisição
                        response.getWriter().write("{\"message\": \"Erro ao atualizar usuário!\"}");
                    }
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - ID inválido
                    response.getWriter().write("{\"message\": \"ID inválido!\"}");
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
                    response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados!\"}");
                    e.printStackTrace();
                }
            }
            // Verifica se a URL segue o formato correto para ativar: /ativar/{ID}
            else if (pathParts.length == 3 && pathParts[1].equals("ativar")) {
                try {
                    int id = Integer.parseInt(pathParts[2]); // Extrai o ID da URL

                    // Chama a função ativarUsuario
                    boolean ativado = ativarUsuario(id); // Retorna true ou false
                    if (ativado) {
                        response.setStatus(HttpServletResponse.SC_OK); // 200 - Sucesso
                        response.getWriter().write("{\"message\": \"Usuário ativado com sucesso!\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 - Usuário não encontrado
                        response.getWriter().write("{\"message\": \"Usuário não encontrado.\"}");
                    }
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - ID inválido
                    response.getWriter().write("{\"message\": \"ID inválido!\"}");
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
                    response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados!\"}");
                    e.printStackTrace();
                }
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Formato da URL inválido
                response.getWriter().write("{\"message\": \"Formato de URL inválido!\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - URL inválida
            response.getWriter().write("{\"message\": \"Formato de URL inválido!\"}");
        }
    }

    // Método auxiliar para buscar o usuário pelo ID
    private Usuario getUsuarioById(int id) {
        try {
            return usuarioDAO.getUsuarioById(id); // Implementação em DBQueryUsuario
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Método auxiliar para ativar o usuário pelo ID
    private boolean ativarUsuario(int id) throws SQLException {
        return usuarioDAO.ativarUsuario(id) > 0; // Retorna true se o usuário for ativado com sucesso
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.startsWith("/delete/")) {
            String[] pathParts = pathInfo.split("/");

            // Verifica se o formato da URL está correto (tem a parte 'delete' e depois o ID)
            if (pathParts.length == 3) {
                try {
                    int id = Integer.parseInt(pathParts[2]); // ID extraído da URL
                    int result = usuarioDAO.inativarUsuario(id);

                    if (result > 0) {
                        response.setStatus(HttpServletResponse.SC_OK); // 200 - Inativação bem-sucedida
                        response.getWriter().write("{\"message\": \"Usuário inativado com sucesso!\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Requisição ruim
                        response.getWriter().write("{\"message\": \"Erro ao inativar usuário!\"}");
                    }
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - ID inválido
                    response.getWriter().write("{\"message\": \"ID inválido!\"}");
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 - Erro no servidor
                    response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados!\"}");
                    e.printStackTrace(); // Imprime o stack trace no log
                }
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Requisição sem ID
                response.getWriter().write("{\"message\": \"ID é necessário!\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 - Formato inválido
            response.getWriter().write("{\"message\": \"Formato de URL inválido!\"}");
        }
    }
}  