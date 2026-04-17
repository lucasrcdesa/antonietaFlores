package com.floricultura.backend.api.imagens;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/imagens")
public class ImagensResource {

    private final ResourceLoader resourceLoader;
    private final String imageLocation;

    public ImagensResource(ResourceLoader resourceLoader,
                           @Value("${produto.images.location:classpath:/static/assets/}") String imageLocation) {
        this.resourceLoader = resourceLoader;
        this.imageLocation = imageLocation;
    }

    @GetMapping("/{path:.+}")
    public ResponseEntity<Resource> buscarImagem(@PathVariable String path) throws IOException {
        String normalizedPath = path.startsWith("/") ? path.substring(1) : path;
        Resource resource = resourceLoader.getResource(imageLocation + normalizedPath);

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        Optional<MediaType> mediaType = MediaTypeFactory.getMediaType(resource);
        MediaType contentType = mediaType.orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
