package com.floricultura.backend.api.whatsapp;

import com.floricultura.backend.application.whatsApp.WhatsAppClientService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/whatsapp/test")
public class WhatsAppTestController {
    private final WhatsAppClientService service;

    public WhatsAppTestController(WhatsAppClientService service) {
        this.service = service;
    }

    @PostMapping
    public void testSend(@RequestParam String to, @RequestParam String msg) {
        service.sendMessage(to, msg);
    }
}
