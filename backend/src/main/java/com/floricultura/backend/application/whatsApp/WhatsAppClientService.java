package com.floricultura.backend.application.whatsApp;

import org.springframework.http.HttpHeaders;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppClientService {
    

    @Value("${whatsapp.token}")
    private String TOKEN;

    @Value("${whatsapp.phone-number-id}")
    private String PHONE_NUMBER_ID;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendMessage(String to, String message) {

        String url = "https://graph.facebook.com/v19.0/" + PHONE_NUMBER_ID + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(TOKEN);

        Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "to", to,
                "type", "text",
                "text", Map.of("body", message)
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}