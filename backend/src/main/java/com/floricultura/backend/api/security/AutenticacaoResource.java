package com.floricultura.backend.api.security;

import com.floricultura.backend.domain.usuario.Usuario;
import com.floricultura.backend.domain.usuario.UsuarioRepository;
import com.floricultura.backend.infra.security.TokenService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AutenticacaoResource {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    // 🔥 LOGIN
    @PostMapping("/login")
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {

        var authenticationToken =
                new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());

        var authentication = manager.authenticate(authenticationToken);
        UserDetails usuario = (UserDetails) authentication.getPrincipal();

        var tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    // 🔥 REGISTER (temporário para teste)
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody DadosAutenticacao dados) {

        String senhaCriptografada =
                new BCryptPasswordEncoder().encode(dados.senha());

        Usuario user = new Usuario(null, dados.login(), senhaCriptografada, null, null);
        repository.salvar(user);

        return ResponseEntity.ok().build();
    }

    // DTOs
    public record DadosAutenticacao(String login, String senha) {}

    public record DadosTokenJWT(String token) {}
}