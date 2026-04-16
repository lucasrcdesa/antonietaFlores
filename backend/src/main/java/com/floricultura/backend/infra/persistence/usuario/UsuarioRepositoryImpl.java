package com.floricultura.backend.infra.persistence.usuario;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.floricultura.backend.domain.usuario.Usuario;
import com.floricultura.backend.domain.usuario.UsuarioRepository;

import org.springframework.stereotype.Repository;

@Repository
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioJpaRepository jpa;

    public UsuarioRepositoryImpl(UsuarioJpaRepository jpa) {
        this.jpa = jpa;
    }

      @Override
    public Usuario salvar(Usuario usuario) {
        UsuarioEntity entity = UsuarioMapper.toEntity(usuario);
        
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        
        UsuarioEntity savedEntity = jpa.save(entity);
        return UsuarioMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return jpa.findById(id)
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByLogin(String login) {
        return jpa.findByLogin(login)
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public List<Usuario> listarTodos() {
        return jpa.findAll()
                .stream()
                .map(UsuarioMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deletar(Long id) {
        jpa.deleteById(id);
    }

}
