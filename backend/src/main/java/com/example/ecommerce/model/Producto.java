package com.example.ecommerce.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data    // 1. Esto crea los Getters y Setters automáticamente (gracias a Lombok)
@Entity  // 2. Esto le dice a Spring que esta clase es una Tabla en la Base de Datos
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 3. ID autoincremental
    private Long id;

    private String nombre;
    private Double precio;
    private String imagenUrl; // Guardaremos la URL de la imagen
}