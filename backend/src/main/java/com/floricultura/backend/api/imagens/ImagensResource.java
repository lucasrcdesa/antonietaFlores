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

import jakarta.servlet.http.HttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/categorias")
    public ResponseEntity<Map<String, Object>> listarCategorias() {
        try {
            Resource assetsResource = resourceLoader.getResource(imageLocation);
            File assetsDir = assetsResource.getFile();

            if (!assetsDir.exists() || !assetsDir.isDirectory()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> result = new HashMap<>();
            List<String> categorias = Arrays.stream(assetsDir.listFiles(File::isDirectory))
                    .map(File::getName)
                    .sorted()
                    .toList();

            result.put("categorias", categorias);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categorias/{categoria}")
    public ResponseEntity<Map<String, Object>> listarImagensPorCategoria(@PathVariable String categoria) {
        try {
            Resource assetsResource = resourceLoader.getResource(imageLocation);
            File assetsDir = assetsResource.getFile();
            File categoriaDir = new File(assetsDir, categoria);

            if (!categoriaDir.exists() || !categoriaDir.isDirectory()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> result = new HashMap<>();
            List<String> imagens = Arrays.stream(categoriaDir.listFiles(File::isFile))
                    .filter(f -> isImageFile(f))
                    .map(File::getName)
                    .sorted()
                    .toList();

            result.put("categoria", categoria);
            result.put("imagens", imagens);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean isImageFile(File file) {
        String name = file.getName().toLowerCase();
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || 
               name.endsWith(".png") || name.endsWith(".gif") || 
               name.endsWith(".webp");
    }

public ResponseEntity<Resource> buscarImagem(HttpServletRequest request) throws IOException {

    String fullPath = request.getRequestURI();

    // remove /api/imagens/
    String path = fullPath.replace("/api/imagens/", "");

    Resource resource = resourceLoader.getResource(imageLocation + path);

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
