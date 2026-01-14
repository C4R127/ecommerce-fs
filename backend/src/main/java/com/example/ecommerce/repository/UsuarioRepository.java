package com.example.ecommerce.repository;

import com.example.ecommerce.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método mágico: Spring crea la consulta SQL automáticamente al leer el nombre
    Optional<Usuario> findByEmailAndPassword(String email, String password);
}