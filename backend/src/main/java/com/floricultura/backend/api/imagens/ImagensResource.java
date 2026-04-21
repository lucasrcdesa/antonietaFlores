package com.floricultura.backend.api.imagens;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.nio.file.Files.isDirectory;
import static java.nio.file.Files.list;
import static java.nio.file.Files.walk;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/imagens")
public class ImagensResource {

    private final ResourceLoader resourceLoader;
    private final PathMatchingResourcePatternResolver resourceResolver;
    private final String imageLocation;

    public ImagensResource(ResourceLoader resourceLoader,
                           @Value("${produto.images.location:classpath:/static/assets/}") String imageLocation) {
        this.resourceLoader = resourceLoader;
        this.resourceResolver = new PathMatchingResourcePatternResolver(resourceLoader);
        this.imageLocation = imageLocation;
    }

    @GetMapping("/categorias")
    public ResponseEntity<Map<String, Object>> listarCategorias() {
        try {
            Set<String> categorias = obterCategorias();

            Map<String, Object> result = new HashMap<>();
            result.put("categorias", categorias.stream().toList());
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categorias/{categoria}")
    public ResponseEntity<Map<String, Object>> listarImagensPorCategoria(@PathVariable String categoria) {
        try {
            if (!obterCategorias().contains(categoria)) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> result = new HashMap<>();
            List<String> imagens = obterImagensDaCategoria(categoria);

            result.put("categoria", categoria);
            result.put("imagens", imagens);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Set<String> obterCategorias() throws IOException {
        if (imageLocation.startsWith("classpath:")) {
            String pattern = "classpath*:/static/assets/**/*.*";
            Resource[] resources = resourceResolver.getResources(pattern);

            Set<String> categorias = new TreeSet<>();
            for (Resource resource : resources) {
                if (!resource.exists()) {
                    continue;
                }
                String relative = extrairRelativePath(resource, "/static/assets/");
                if (relative == null || relative.isBlank()) {
                    continue;
                }
                String[] parts = relative.split("/");
                if (parts.length > 1 && isImageFile(parts[parts.length - 1])) {
                    categorias.add(parts[0]);
                }
            }
            return categorias;
        }

        Path assetsPath = resolverAssetsPathFisico();
        if (!isDirectory(assetsPath)) {
            return Set.of();
        }

        try (Stream<Path> stream = list(assetsPath)) {
            return stream
                    .filter(java.nio.file.Files::isDirectory)
                    .map(path -> path.getFileName().toString())
                    .collect(Collectors.toCollection(TreeSet::new));
        }
    }

    private List<String> obterImagensDaCategoria(String categoria) throws IOException {
        if (imageLocation.startsWith("classpath:")) {
            String pattern = "classpath*:/static/assets/" + categoria + "/**/*.*";
            Resource[] resources = resourceResolver.getResources(pattern);

            return Stream.of(resources)
                    .filter(Resource::exists)
                    .map(resource -> extrairRelativePath(resource, "/static/assets/" + categoria + "/"))
                    .filter(path -> path != null && !path.isBlank())
                    .filter(this::isImageFile)
                    .sorted()
                    .toList();
        }

        Path categoriaPath = resolverAssetsPathFisico().resolve(categoria);
        if (!isDirectory(categoriaPath)) {
            return List.of();
        }

        try (Stream<Path> stream = walk(categoriaPath)) {
            return stream
                    .filter(java.nio.file.Files::isRegularFile)
                    .map(path -> categoriaPath.relativize(path).toString().replace("\\", "/"))
                    .filter(this::isImageFile)
                    .sorted()
                    .toList();
        }
    }

    private Path resolverAssetsPathFisico() {
        String normalized = imageLocation;
        if (normalized.startsWith("file:")) {
            normalized = normalized.substring("file:".length());
        }
        return Paths.get(normalized);
    }

    private String extrairRelativePath(Resource resource, String marker) {
        try {
            String url = resource.getURL().toString().replace("\\", "/");
            int idx = url.indexOf(marker);
            if (idx < 0) {
                return null;
            }
            return url.substring(idx + marker.length());
        } catch (IOException e) {
            return null;
        }
    }

    private boolean isImageFile(String name) {
        String normalized = name.toLowerCase();
        return normalized.endsWith(".jpg") || normalized.endsWith(".jpeg") ||
                normalized.endsWith(".png") || normalized.endsWith(".gif") ||
                normalized.endsWith(".webp");
    }

    @GetMapping("/**")
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
