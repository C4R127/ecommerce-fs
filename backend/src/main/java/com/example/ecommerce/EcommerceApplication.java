package com.example.ecommerce;

import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class EcommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioRepository usuarioRepository) {
		return args -> {
			String emailAdmin = "admin@tienda.com";
			String passFacil = "54321"; // <--- AQUÍ ESTÁ TU NUEVA CONTRASEÑA

			// 1. Traemos todos los usuarios para buscar al admin manualmentente
			// (Hacemos esto para no tener que modificar el Repositorio añadiendo findByEmail)
			List<Usuario> usuarios = usuarioRepository.findAll();
			Usuario admin = null;

			for (Usuario u : usuarios) {
				if (u.getEmail().equals(emailAdmin)) {
					admin = u;
					break;
				}
			}

			if (admin != null) {
				// SI YA EXISTE: Le actualizamos la contraseña
				admin.setPassword(passFacil);
				usuarioRepository.save(admin);
				System.out.println("🔄 ADMIN ACTUALIZADO: " + emailAdmin + " / " + passFacil);
			} else {
				// SI NO EXISTE: Lo creamos desde cero
				admin = new Usuario();
				admin.setEmail(emailAdmin);
				admin.setPassword(passFacil);
				admin.setNombre("Super Administrador");
				admin.setRol("ADMIN");
				usuarioRepository.save(admin);
				System.out.println("👑 ADMIN CREADO: " + emailAdmin + " / " + passFacil);
			}
		};
	}
}