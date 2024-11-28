package api;

import com.google.gson.Gson;
import database.UbsDAO;
import model.Ubs;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class UbsServlet extends HttpServlet {

    private UbsDAO ubsDAO;

    // Inicializa o DAO no momento da inicialização do servlet
    @Override
    public void init() throws ServletException {
        super.init();
        ubsDAO = new UbsDAO();
    }

    // Trata requisições GET
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo != null && pathInfo.startsWith("/inativo")) {
                String[] pathParts = pathInfo.split("/");

                if (pathParts.length == 3) {
                    int id = Integer.parseInt(pathParts[2]);
                    Ubs ubsInativa = ubsDAO.getUbsByIdInativo(id);

                    if (ubsInativa != null) {
                        response.getWriter().write(new Gson().toJson(ubsInativa)); // Retorna UBS inativa como JSON
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        response.getWriter().write("{\"message\": \"UBS inativa não encontrada.\"}");
                    }
                } else if (pathParts.length == 2) {
                    List<Ubs> ubsInativas = ubsDAO.getUbsInativas();
                    response.getWriter().write(new Gson().toJson(ubsInativas)); // Retorna lista de UBS inativas
                }
            } else if (pathInfo != null && pathInfo.split("/").length == 2) {
                int id = Integer.parseInt(pathInfo.split("/")[1]);
                Ubs ubs = ubsDAO.getUbsById(id);

                if (ubs != null) {
                    response.getWriter().write(new Gson().toJson(ubs)); // Retorna UBS como JSON
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("{\"message\": \"UBS não encontrada.\"}");
                }
            } else {
                List<Ubs> ubsList = ubsDAO.getAllUbs();
                response.getWriter().write(new Gson().toJson(ubsList)); // Retorna lista de todas as UBS
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\": \"Erro ao recuperar as UBS.\"}");
            e.printStackTrace();
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\": \"ID inválido.\"}");
        }
    }

    // Trata requisições POST
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
        Gson gson = new Gson();
        Ubs ubs = gson.fromJson(jsonBody, Ubs.class);

        try {
            if (checkCepExists(ubs.getCep())) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"CEP já cadastrado.\"}");
                return;
            }

            Ubs ubsExistente = ubsDAO.getUbsByLatLonNome(ubs.getLatitude(), ubs.getLongitude(), ubs.getNome());
            if (ubsExistente != null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"Erro ao cadastrar UBS.\"}");
                return;
            }

            int result = ubsDAO.insertUbs(ubs);
            if (result > 0) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().write("{\"status\": \"success\", \"message\": \"UBS cadastrada com sucesso.\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\": \"Já existe um cadastro com essas coordenadas de latitude e longitude.\"}");
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados.\"}");
            e.printStackTrace();
        }
    }

    // Trata requisições PUT
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo != null) {
            String[] pathParts = pathInfo.split("/");

            if (pathParts.length == 3) {
                try {
                    int id = Integer.parseInt(pathParts[2]);

                    if (pathParts[1].equals("atualizar")) {
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = request.getReader().readLine()) != null) {
                            sb.append(line);
                        }

                        Gson gson = new Gson();
                        Ubs ubs = gson.fromJson(sb.toString(), Ubs.class);
                        ubs.setId(id);

                        Ubs ubsAntiga = this.getUbsById(id);
                        if (!ubs.getCep().equals(ubsAntiga.getCep()) && checkCepExists(ubs.getCep())) {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            response.getWriter().write("{\"message\": \"CEP já cadastrado.\"}");
                            return;
                        }

                        if (ubs.getLatitude() != ubsAntiga.getLatitude() || ubs.getLongitude() != ubsAntiga.getLongitude()) {
                            Ubs ubsExistente = ubsDAO.getUbsByLatLonNome(ubs.getLatitude(), ubs.getLongitude(), ubs.getNome());
                            if (ubsExistente != null && ubsExistente.getId() != ubs.getId()) {
                                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                                response.getWriter().write("{\"message\": \"Erro ao atualizar UBS.\"}");
                                return;
                            }
                        }

                        int result = ubsDAO.updateUbs(ubs);
                        if (result > 0) {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("{\"message\": \"UBS atualizada com sucesso.\"}");
                        } else {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            response.getWriter().write("{\"message\": \"Já existe um cadastro com essas coordenadas de latitude e longitude.\"}");
                        }
                    } else if (pathParts[1].equals("ativar")) {
                        int result = ubsDAO.ativarUbs(id);
                        if (result > 0) {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("{\"message\": \"UBS ativada com sucesso.\"}");
                        } else {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            response.getWriter().write("{\"message\": \"Erro ao ativar UBS.\"}");
                        }
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().write("{\"message\": \"Formato de URL inválido.\"}");
                    }
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados.\"}");
                    e.printStackTrace();
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"message\": \"ID inválido.\"}");
                }
            }
        }
    }

    // Trata requisições DELETE
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String pathInfo = request.getPathInfo();

        if (pathInfo != null) {
            String[] pathParts = pathInfo.split("/");

            if (pathParts.length == 3) {
                try {
                    int id = Integer.parseInt(pathParts[2]);
                    int result = ubsDAO.inativarUbs(id);

                    if (result > 0) {
                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write("{\"message\": \"UBS deletada com sucesso.\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().write("{\"message\": \"Erro ao deletar UBS.\"}");
                    }
                } catch (SQLException e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"message\": \"Erro ao conectar com o banco de dados.\"}");
                    e.printStackTrace();
                } catch (NumberFormatException e) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"message\": \"ID inválido.\"}");
                }
            }
        }
    }


    private boolean checkCepExists(String cep) throws SQLException {
        return ubsDAO.checkCepExists(cep);
    }

    private Ubs getUbsById(int id) throws SQLException {
        return ubsDAO.getUbsById(id);
    }
}
