package com.floricultura.backend.infra.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.floricultura.backend.application.security.UsuarioSecurityAdapter;
import com.floricultura.backend.domain.usuario.UsuarioRepository;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    // 🔥 IGNORA ROTAS PÚBLICAS (LOGIN E IMAGENS)
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();

        // Sempre libera OPTIONS (CORS preflight)
        if (method.equals("OPTIONS")) {
            return true;
        }

        // Libera login
        if (path.equals("/auth/login")) {
            return true;
        }

        // Libera imagens (com ou sem barra no final)
        if (path.startsWith("/api/imagens")) {
            System.out.println("🖼️ Liberando acesso a imagem: " + path);
            return true;
        }

        // Libera GET de produtos
        if (path.startsWith("/api/produtos") && method.equals("GET")) {
            return true;
        }

        // Libera webhook do WhatsApp
        if (path.equals("/webhook/whatsapp")) {
            return true;
        }

        // Libera endpoint de teste do WhatsApp
        if (path.startsWith("/whatsapp/") && method.equals("POST")) {
            return true;
        }

        System.out.println("🔒 Filtro JWT aplicado para: " + method + " " + path);
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain)
            throws ServletException, IOException {

        try {
            var tokenJWT = recuperarToken(request);

            if (tokenJWT != null) {
                var subject = tokenService.getSubject(tokenJWT);
                var usuario = repository.findByLogin(subject);

                if (usuario.isPresent()) {
                    UserDetails userDetails = new UsuarioSecurityAdapter(usuario.get());
                    var authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

        } catch (Exception e) {
            // 🔥 Não quebra a requisição por causa de token inválido
            System.out.println("Erro no filtro JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }

        return null;
    }
}