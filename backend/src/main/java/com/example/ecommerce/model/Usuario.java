package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true) // No pueden haber dos usuarios con el mismo correo
    private String email;

    private String password;
    private String nombre;
    private String rol; // "ADMIN" o "CLIENTE"
}