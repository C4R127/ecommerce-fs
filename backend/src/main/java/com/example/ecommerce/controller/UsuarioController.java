package com.example.ecommerce.controller;

import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Endpoint para Login
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        // Buscamos si existe alguien con ese email Y esa contraseña
        return usuarioRepository.findByEmailAndPassword(usuario.getEmail(), usuario.getPassword())
                .orElse(null); // Si no existe, devolvemos null (login fallido)
    }

    // Endpoint para Registrarse (Crear cuenta)
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        // Por defecto, todos los que se registran son CLIENTES
        if (usuario.getRol() == null) {
            usuario.setRol("CLIENTE");
        }
        return usuarioRepository.save(usuario);
    }
}