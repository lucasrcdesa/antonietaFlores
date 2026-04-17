package com.floricultura.backend.domain.usuario;

import java.time.LocalDateTime;

public class Usuario {

    private Long id;
    private String login;
    private String senha;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getPassword() {
        return senha;
    }

    public String getUsername() {
        return login;
    }

    public Long getId() {
        return id;
    }

public String getLogin() {
    return login;
}

public String getSenha() {
    return senha;
}

public LocalDateTime getCreatedAt() {
    return createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public LocalDateTime getUpdatedAt() {
    return updatedAt;
}

public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}

public Usuario() {
}

public Usuario(Long id, String login, String senha, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.login = login;
    this.senha = senha;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
}

    // Getters, Setters e Constructors...
}