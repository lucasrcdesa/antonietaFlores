package com.floricultura.backend.infra.persistence.produto;

import com.floricultura.backend.domain.produto.Produto;

public class ProdutoMapper {

    public static ProdutoEntity toEntity(Produto produto) {
        ProdutoEntity entity = new ProdutoEntity();

        entity.setId(produto.getId());
        entity.setSku(produto.getSKU());
        entity.setNome(produto.getNome());
        entity.setDescricao(produto.getDescricao());
        entity.setPreco(produto.getPreco());
        entity.setQuantidadeEstoque(produto.getQuantidadeEstoque());
        entity.setAtivo(produto.getAtivo());
        entity.setCategoria(produto.getCategoria());
        entity.setImagemUrl(produto.getImagemUrl());
        entity.setCreatedAt(produto.getCreatedAt());
        entity.setUpdatedAt(produto.getUpdatedAt());

        return entity;
    }

    public static Produto toDomain(ProdutoEntity entity) {
        Produto produto = new Produto(
                entity.getId(),
                entity.getSku(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getPreco(),
                entity.getQuantidadeEstoque(),
                entity.getAtivo(),
                entity.getCategoria(),
                entity.getImagemUrl(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
        return produto;
    }
}