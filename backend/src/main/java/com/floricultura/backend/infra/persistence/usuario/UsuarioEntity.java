package com.floricultura.backend.infra.persistence.usuario;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String senha;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
    return id;
}

public String getLogin() {
    return login;
}

public String getSenha() {
    return senha;
}



public void setId(Long id) {
    this.id = id;
}

public void setLogin(String login) {
    this.login = login;
}

public void setSenha(String senha) {
    this.senha = senha;
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

}