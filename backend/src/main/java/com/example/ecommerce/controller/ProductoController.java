package com.example.ecommerce.controller;

import com.example.ecommerce.model.Producto;
import com.example.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public Iterable<Producto> obtenerProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }
    //--- ENDPOINT: ACTUALIZAR PRODUCTO ---
    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto productoDetalles) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            producto.setNombre(productoDetalles.getNombre());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setImagenUrl(productoDetalles.getImagenUrl());
            return productoRepository.save(producto);
        }
        return null;
    }
    //--- ENDPOINT: CAMBIAR ESTADO (ACTIVO/INACTIVO) ---
    @PutMapping("/{id}/estado")
    public Producto cambiarEstado(@PathVariable Long id) {
        Producto p = productoRepository.findById(id).orElse(null);
        if (p != null) {
            // Si es true lo vuelve false, y viceversa (Interruptor)
            // Si es null, asumimos que estaba activo y lo desactivamos
            boolean nuevoEstado = (p.getActivo() == null) ? false : !p.getActivo();
            p.setActivo(nuevoEstado);
            return productoRepository.save(p);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }

    // --- ENDPOINT: IMPORTAR 100 PRODUCTOS (DummyJSON) ---
    // Este método AGREGA los productos nuevos a los que ya tienes
    @PostMapping("/importar")
    public String importarDesdeDummyJSON() {
        String url = "https://dummyjson.com/products?limit=100";
        RestTemplate restTemplate = new RestTemplate();

        DummyResponse respuesta = restTemplate.getForObject(url, DummyResponse.class);
        if (respuesta == null || respuesta.products == null) return "Error al conectar con la API";

        List<Producto> nuevosProductos = new ArrayList<>();

        for (DummyProduct fake : respuesta.products) {
            Producto p = new Producto();
            p.setNombre(fake.title);
            p.setPrecio(fake.price);
            p.setImagenUrl(fake.thumbnail);
            p.setCategoria(fake.category); // <--- AQUI GUARDAMOS LA CATEGORIA

            p.setDescripcion(fake.description);
            nuevosProductos.add(p);
        }

        productoRepository.saveAll(nuevosProductos);
        return "¡Éxito! Se agregaron " + nuevosProductos.size() + " productos con categorías.";
    }

    // Clases auxiliares para leer la respuesta de DummyJSON
    static class DummyResponse {
        public List<DummyProduct> products;
    }

    static class DummyProduct {
        public String title;
        public Double price;
        public String thumbnail;
        public String category;
        public String description;
    }
}