package com.floricultura.backend.application.produto;

import com.floricultura.backend.domain.produto.Produto;
import com.floricultura.backend.domain.produto.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

	private final ProdutoRepository produtoRepository;

	public ProdutoService(ProdutoRepository produtoRepository) {
		this.produtoRepository = produtoRepository;
	}

	public Produto salvar(Produto produto) {
		return produtoRepository.salvar(produto);
	}

	public Optional<Produto> buscarPorId(Long id) {
		return produtoRepository.buscarPorId(id);
	}

	public List<Produto> listarTodos() {
		return produtoRepository.listarTodos();
	}

	public void deletar(Long id) {
		produtoRepository.deletar(id);
	}
}
