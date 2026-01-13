package com.example.ecommerce.controller;

import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        pedido.setFecha(LocalDateTime.now()); // Ponemos la fecha automática del servidor
        return pedidoRepository.save(pedido);
    }

    // Para que el Admin vea las ventas después
    @GetMapping
    public Iterable<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }
}