package com.floricultura.backend.domain.usuario;

import java.util.List;
import java.util.Optional;


public interface UsuarioRepository  {
     Usuario salvar(Usuario usuario);

    Optional<Usuario> buscarPorId(Long id);

    Optional<Usuario> findByLogin(String login);

    List<Usuario> listarTodos();

    void deletar(Long id);
}
