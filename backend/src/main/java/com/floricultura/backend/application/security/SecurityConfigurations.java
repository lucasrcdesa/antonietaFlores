package com.floricultura.backend.application.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.floricultura.backend.infra.security.SecurityFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // 🔓 LOGIN
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // 🔓 PRODUTOS (público)
                        .requestMatchers(HttpMethod.GET, "/api/produtos", "/api/produtos/**").permitAll()

                        // 🔓 IMAGENS
                        .requestMatchers(HttpMethod.GET, "/api/imagens/**").permitAll()

                        // 🔓 WHATSAPP WEBHOOK
                        .requestMatchers(HttpMethod.GET, "/webhook/whatsapp").permitAll()
                        .requestMatchers(HttpMethod.POST, "/webhook/whatsapp").permitAll()

                        // 🔓 WHATSAPP TESTE (temporário)
                        .requestMatchers(HttpMethod.POST, "/whatsapp/test").permitAll()

                        // 🔓 CORS (preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔒 TODO RESTO
                        .anyRequest().authenticated()
                )

                // 🔥 desativa padrões do Spring
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 🔥 JWT filter
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    // 🔥 Necessário pro login funcionar
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🔥 Encoder de senha
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}