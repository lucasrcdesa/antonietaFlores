package com.floricultura.backend.application.whatsApp;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppClientService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppClientService.class);

    @Value("${whatsapp.token}")
    private String TOKEN;

    @Value("${whatsapp.phone-number-id}")
    private String PHONE_NUMBER_ID;

    @Value("${whatsapp.graph-api-version:v25.0}")
    private String graphApiVersion;

    @Value("${whatsapp.site-url}")
    private String siteUrl;

    @Value("${whatsapp.catalog-url}")
    private String catalogUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String sendMessage(String to, String message) {

        String normalizedTo = normalizePhoneNumber(to);

        String url = "https://graph.facebook.com/" + graphApiVersion + "/" + PHONE_NUMBER_ID + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(TOKEN);

        Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "to", normalizedTo,
                "type", "text",
                "text", Map.of("body", message)
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            var response = restTemplate.postForEntity(url, request, String.class);
            String responseBody = response.getBody() == null ? "{}" : response.getBody();
            log.info("WhatsApp message sent to {} with status {}", normalizedTo, response.getStatusCode().value());
            return responseBody;
        } catch (HttpStatusCodeException ex) {
            log.error("WhatsApp send failed. status={} body={}", ex.getStatusCode().value(), ex.getResponseBodyAsString());
            throw new IllegalStateException("Falha ao enviar WhatsApp: " + ex.getResponseBodyAsString(), ex);
        }
    }

    public void processWebhook(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return;
        }

        Object entriesObject = payload.get("entry");
        if (!(entriesObject instanceof List<?> entries)) {
            return;
        }

        for (Object entryObject : entries) {
            Map<String, Object> entry = asMap(entryObject);
            Object changesObject = entry.get("changes");

            if (!(changesObject instanceof List<?> changes)) {
                continue;
            }

            for (Object changeObject : changes) {
                Map<String, Object> change = asMap(changeObject);
                Map<String, Object> value = asMap(change.get("value"));
                Object messagesObject = value.get("messages");

                if (!(messagesObject instanceof List<?> messages) || messages.isEmpty()) {
                    continue;
                }

                for (Object messageObject : messages) {
                    Map<String, Object> messageNode = asMap(messageObject);
                    String from = asString(messageNode.get("from"));
                    String messageText = extractMessageText(messageNode);

                    if (from == null || from.isBlank() || messageText == null || messageText.isBlank()) {
                        continue;
                    }

                    log.info("Incoming WhatsApp message from {}: {}", from, messageText);
                    sendMessage(from, buildInitialMenuMessage());
                }
            }
        }
    }

    private String normalizePhoneNumber(String rawNumber) {
        if (rawNumber == null || rawNumber.isBlank()) {
            throw new IllegalArgumentException("Número de destino vazio.");
        }

        String normalized = rawNumber.replaceAll("\\D", "");
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Número de destino inválido: " + rawNumber);
        }

        return normalized;
    }

    private String extractMessageText(Map<String, Object> messageNode) {
        String type = asString(messageNode.get("type"));

        if ("text".equals(type)) {
            return asString(asMap(messageNode.get("text")).get("body"));
        }

        if ("interactive".equals(type)) {
            Map<String, Object> interactive = asMap(messageNode.get("interactive"));
            String buttonReply = asString(asMap(interactive.get("button_reply")).get("title"));
            if (buttonReply != null && !buttonReply.isBlank()) {
                return buttonReply;
            }

            return asString(asMap(interactive.get("list_reply")).get("title"));
        }

        return type;
    }

    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> mapValue) {
            @SuppressWarnings("unchecked")
            Map<String, Object> casted = (Map<String, Object>) mapValue;
            return casted;
        }

        return Map.of();
    }

    private String asString(Object value) {
        return value instanceof String text ? text : null;
    }

    private String buildInitialMenuMessage() {
        return String.format(
                "Olá! Seja bem-vindo(a) à Antonieta Flores.%n%n" +
                        "1 - Acessar site: %s%n" +
                        "2 - Ver catálogo: %s%n%n" +
                        "Em breve algum colaborador irá atender você.",
                siteUrl,
                catalogUrl
        );
    }
}