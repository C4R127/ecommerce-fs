package com.example.ecommerce.controller;

import com.example.ecommerce.model.Producto;
import com.example.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate; // Importante para llamar a la API externa

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

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }

    // --- NUEVO: ENDPOINT PARA IMPORTAR DESDE API EXTERNA ---
    @PostMapping("/importar")
    public String importarDesdeFakeStore() {
        String url = "https://fakestoreapi.com/products";
        RestTemplate restTemplate = new RestTemplate();

        // 1. Descargamos los datos de la API externa
        FakeProductDTO[] productosExternos = restTemplate.getForObject(url, FakeProductDTO[].class);

        if (productosExternos == null) return "Error al conectar con la API";

        // 2. Convertimos y guardamos en NUESTRA base de datos
        List<Producto> nuevosProductos = new ArrayList<>();

        for (FakeProductDTO fake : productosExternos) {
            Producto p = new Producto();
            p.setNombre(fake.title); // Mapeamos 'title' a 'nombre'
            p.setPrecio(fake.price);
            p.setImagenUrl(fake.image); // Mapeamos 'image' a 'imagenUrl'

            nuevosProductos.add(p);
        }

        productoRepository.saveAll(nuevosProductos);
        return "¡Éxito! Se importaron " + nuevosProductos.size() + " productos.";
    }

    // Clase auxiliar para leer el formato de FakeStoreAPI
    // (Tiene que ser estática para usarse aquí dentro)
    static class FakeProductDTO {
        public String title;
        public Double price;
        public String image;
        // Ignoramos descripción y categoría por ahora
    }
}