package com.floricultura.backend.application.produto;

import com.floricultura.backend.domain.produto.Produto;
import com.floricultura.backend.domain.produto.ProdutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

	private static final Logger log = LoggerFactory.getLogger(ProdutoService.class);

	private final ProdutoRepository produtoRepository;

	public ProdutoService(ProdutoRepository produtoRepository) {
		this.produtoRepository = produtoRepository;
	}

	public Produto salvar(Produto produto) {
		Produto salvo = produtoRepository.salvar(produto);
		log.info("Produto salvo: id={}, nome={}", salvo.getId(), salvo.getNome());
		return salvo;
	}

	public Optional<Produto> buscarPorId(Long id) {
		Optional<Produto> resultado = produtoRepository.buscarPorId(id);
		if (resultado.isEmpty()) {
			log.warn("Produto não encontrado: id={}", id);
		}
		return resultado;
	}

	public List<Produto> listarTodos() {
		List<Produto> produtos = produtoRepository.listarTodos();
		log.debug("Listagem de produtos: {} itens retornados", produtos.size());
		return produtos;
	}

	public void deletar(Long id) {
		if (produtoRepository.buscarPorId(id).isEmpty()) {
			log.warn("Tentativa de deletar produto inexistente: id={}", id);
			return;
		}
		produtoRepository.deletar(id);
		log.info("Produto deletado: id={}", id);
	}
}
