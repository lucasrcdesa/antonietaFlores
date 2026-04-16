package com.floricultura.backend.infra.persistence.usuario;

import com.floricultura.backend.domain.usuario.Usuario;

public class UsuarioMapper {
  
     public static UsuarioEntity toEntity(Usuario usuario) {
        UsuarioEntity entity = new UsuarioEntity();

        entity.setId(usuario.getId());
        entity.setLogin(usuario.getLogin());
        entity.setSenha(usuario.getPassword());
        entity.setCreatedAt(usuario.getCreatedAt());
        entity.setUpdatedAt(usuario.getUpdatedAt());
        return entity;
    }

    public static Usuario toDomain(UsuarioEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getLogin(),
                entity.getSenha(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

}
