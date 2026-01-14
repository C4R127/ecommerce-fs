package com.example.ecommerce.controller;

import com.example.ecommerce.model.Producto;
import com.example.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")           // Define la URL base: http://localhost:8080/api/productos
@CrossOrigin(origins = "http://localhost:5173") // ¡IMPORTANTE! Permite que React (puerto 5173) nos pida datos
public class ProductoController {

    @Autowired
    private ProductoRepository repositorio;

    // 1. Obtener todos los productos (GET)
    @GetMapping
    public List<Producto> listarProductos() {
        return repositorio.findAll();
    }

    // 2. Guardar un producto nuevo (POST)
    @PostMapping
    public Producto guardarProducto(@RequestBody Producto producto) {
        return repositorio.save(producto);
    }
    // 3. Borrar un producto por ID (DELETE)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repositorio.deleteById(id);
    }
    // 4. Actualizar un producto existente (PUT)
    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        // Forzamos que el ID del producto sea el que viene en la URL
        producto.setId(id);
        return repositorio.save(producto); // .save() sirve para crear Y para actualizar
    }
}