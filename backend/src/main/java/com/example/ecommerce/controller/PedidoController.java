package com.example.ecommerce.controller;

import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.model.Usuario; // Importar
import com.example.ecommerce.repository.PedidoRepository;
import com.example.ecommerce.repository.UsuarioRepository; // Importar
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired // Inyectamos el repo de usuarios para buscar al comprador
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        // El frontend nos enviará un pedido que trae dentro un "usuario": { "id": 1 }
        // Java intentará vincularlo automáticamente, pero para estar seguros:
        if (pedido.getUsuario() != null && pedido.getUsuario().getId() != null) {
            Usuario comprador = usuarioRepository.findById(pedido.getUsuario().getId()).orElse(null);
            pedido.setUsuario(comprador);
        }

        pedido.setFecha(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }

    @GetMapping
    public Iterable<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }
}