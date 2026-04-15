package com.floricultura.backend.api.produtos;

import com.floricultura.backend.application.produto.ProdutoService;
import com.floricultura.backend.domain.produto.Produto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutosResource {

	private final ProdutoService produtoService;

	public ProdutosResource(ProdutoService produtoService) {
		this.produtoService = produtoService;
	}

	@PostMapping
	public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
		Produto salvo = produtoService.salvar(produto);
		return ResponseEntity.ok(salvo);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
		return produtoService.buscarPorId(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping
	public ResponseEntity<List<Produto>> listarTodos() {
		return ResponseEntity.ok(produtoService.listarTodos());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		produtoService.deletar(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
		if (!produtoService.buscarPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		produto.setId(id);
		Produto atualizado = produtoService.salvar(produto);
		return ResponseEntity.ok(atualizado);
	}
}
