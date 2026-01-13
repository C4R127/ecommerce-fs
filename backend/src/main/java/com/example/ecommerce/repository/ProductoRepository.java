package com.example.ecommerce.repository;

import com.example.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // ¡Magia! Al extender de JpaRepository, ya tienes listos métodos como:
    // .findAll()  -> Buscar todos
    // .save()     -> Guardar
    // .findById() -> Buscar por ID
    // .delete()   -> Borrar
}