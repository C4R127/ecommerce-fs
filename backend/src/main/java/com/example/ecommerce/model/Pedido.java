package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat; // Asegúrate de tener este import
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecha;

    private Double total;

    @ManyToMany
    private List<Producto> productos;

    // --- NUEVO: Relación con Usuario ---
    @ManyToOne
    @JoinColumn(name = "usuario_id") // Crea una columna 'usuario_id' en la tabla Pedido
    private Usuario usuario;
}