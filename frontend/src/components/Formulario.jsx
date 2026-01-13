import { useState } from "react";
import { crearProducto } from "../services/productoService";

function Formulario({ alGuardar }) {
  // Estados para guardar lo que escribes en los inputs
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault(); // Evita que la página se recargue sola
    
    // Preparamos el paquete de datos
    const nuevoProducto = { 
        nombre, 
        precio: parseFloat(precio), // Convertimos texto a número decimal
        imagenUrl 
    };
    
    // Enviamos al Backend
    const guardado = await crearProducto(nuevoProducto);
    
    if (guardado) {
      alert("¡Producto creado con éxito!");
      // Limpiamos los campos
      setNombre("");
      setPrecio("");
      setImagenUrl("");
      // Avisamos a App.jsx que recargue la lista
      alGuardar(); 
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="formulario-admin">
      <h3>➕ Agregar Nuevo Producto</h3>
      <div className="inputs-container">
        <input 
          type="text" 
          placeholder="Nombre del producto" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required
        />
        <input 
          type="number" 
          placeholder="Precio" 
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          required
        />
        <input 
          type="text" 
          placeholder="URL de la imagen (http...)" 
          value={imagenUrl} 
          onChange={(e) => setImagenUrl(e.target.value)} 
        />
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}

export default Formulario;