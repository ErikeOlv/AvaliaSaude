package model;

import java.sql.Timestamp;

public class Avaliacao {

    private int id;
    private int ubsId;
    private String ubsNome;
    private int usuarioId;
    private String usuarioNome;
    private int nota;
    private String comentario;
    private Timestamp dataAvaliacao;

    // Getters e setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUbsId() {
        return ubsId;
    }

    public void setUbsId(int ubsId) {
        this.ubsId = ubsId;
    }

    public String getUbsNome() {
        return ubsNome;
    }

    public void setUbsNome(String ubsNome) {
        this.ubsNome = ubsNome;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Timestamp getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(Timestamp dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}
