package com.floricultura.backend.application.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.floricultura.backend.application.security.UsuarioSecurityAdapter;
import com.floricultura.backend.domain.usuario.UsuarioRepository;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username)
                .map(UsuarioSecurityAdapter::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}