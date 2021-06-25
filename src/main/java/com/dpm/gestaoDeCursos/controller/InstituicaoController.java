package com.dpm.gestaoDeCursos.controller;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dpm.gestaoDeCursos.model.Instituicao;
import com.dpm.gestaoDeCursos.repository.InstituicaoRepository;

@RestController
@RequestMapping("/universidades")
@CrossOrigin
public class InstituicaoController {
	
	@Autowired
	private InstituicaoRepository instituicaoRepository;
	
	@Autowired
	EntityManager em;

	@GetMapping
	public ResponseEntity<?> consultarTodas(Pageable pageable){
		TypedQuery<Instituicao> universidades =  em.createQuery("select v from Instituicao v",Instituicao.class);
		Long universidadesTotal = instituicaoRepository.count();
		if(universidades.getResultList().isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}	
		
		int paginaAtual = pageable.getPageNumber();
		int totalRegistrosPorPagina = pageable.getPageSize();
		int primeiroRegistroDaPagina = paginaAtual * totalRegistrosPorPagina;
		
		universidades.setFirstResult(primeiroRegistroDaPagina);
		universidades.setMaxResults(totalRegistrosPorPagina);
		
		PageImpl<?> universidadesRetorno = new PageImpl<>(universidades.getResultList(), pageable, universidadesTotal);
		
		return ResponseEntity.ok(universidadesRetorno);
	}
	
	@PostMapping
	public ResponseEntity<?> adicionarUniversidade(@RequestBody Instituicao instituicao){
		instituicao.setId(null);
		Instituicao instituicaoSalva = instituicaoRepository.save(instituicao);
		return ResponseEntity.status(HttpStatus.CREATED).body(instituicaoSalva);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> removerUniversidade(@PathVariable Long id){
		Optional<Instituicao> instituicao = instituicaoRepository.findById(id);
		if(instituicao.isPresent()) {
			instituicaoRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> atualizarUniversidade(@PathVariable Long id, @RequestBody Instituicao instituicaoRecebida){
		Optional<Instituicao> instituicao = instituicaoRepository.findById(id);
		if(instituicao.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}else {
			BeanUtils.copyProperties(instituicaoRecebida, instituicao.get(), "id");
			instituicaoRepository.save(instituicao.get());
			return ResponseEntity.ok(instituicao.get());
		}
	}
	
}
