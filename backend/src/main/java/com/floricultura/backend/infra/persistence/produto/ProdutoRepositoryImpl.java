package com.floricultura.backend.infra.persistence.produto;

import com.floricultura.backend.domain.produto.Produto;
import com.floricultura.backend.domain.produto.ProdutoRepository;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ProdutoRepositoryImpl implements ProdutoRepository {

    private final ProdutoJpaRepository jpa;

    public ProdutoRepositoryImpl(ProdutoJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Produto salvar(Produto produto) {
        ProdutoEntity entity = ProdutoMapper.toEntity(produto);
        
        if (entity.getId() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        
        ProdutoEntity savedEntity = jpa.save(entity);
        return ProdutoMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Produto> buscarPorId(Long id) {
        return jpa.findById(id)
                .map(ProdutoMapper::toDomain);
    }

    @Override
    public List<Produto> listarTodos() {
        return jpa.findAll()
                .stream()
                .map(ProdutoMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deletar(Long id) {
        jpa.deleteById(id);
    }
}
