import { useState, useEffect } from "react";
import { crearProducto, actualizarProducto } from "../services/productoService";

function Formulario({ alGuardar, productoEditando, alCancelar }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  // EFECTO: Cada vez que "productoEditando" cambia, rellenamos los inputs
  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(productoEditando.precio);
      setImagenUrl(productoEditando.imagenUrl);
    } else {
      limpiar();
    }
  }, [productoEditando]);

  const limpiar = () => {
    setNombre("");
    setPrecio("");
    setImagenUrl("");
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    const productoDatos = { 
        nombre, 
        precio: parseFloat(precio), 
        imagenUrl 
    };

    if (productoEditando) {
      // --- MODO ACTUALIZAR ---
      await actualizarProducto(productoEditando.id, productoDatos);
      alert("¡Producto actualizado!");
      alCancelar(); // Salimos del modo edición
    } else {
      // --- MODO CREAR ---
      await crearProducto(productoDatos);
      alert("¡Producto creado!");
      limpiar();
    }
    
    alGuardar(); // Recargamos la lista en App.jsx
  };

  return (
    <form onSubmit={manejarEnvio} className="formulario-admin">
      <h3>
        {productoEditando ? `✏️ Editando: ${productoEditando.nombre}` : "➕ Agregar Nuevo Producto"}
      </h3>
      
      <div className="inputs-container">
        <input 
          type="text" 
          placeholder="Nombre" 
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
          placeholder="URL Imagen" 
          value={imagenUrl} 
          onChange={(e) => setImagenUrl(e.target.value)} 
        />
        
        {/* El botón cambia de color y texto según el modo */}
        <button type="submit" style={{ backgroundColor: productoEditando ? "#f39c12" : "#27ae60" }}>
          {productoEditando ? "Actualizar" : "Guardar"}
        </button>

        {/* Si estamos editando, mostramos botón de Cancelar */}
        {productoEditando && (
            <button type="button" onClick={alCancelar} style={{backgroundColor: "#7f8c8d", marginLeft: "10px"}}>
                Cancelar
            </button>
        )}
      </div>
    </form>
  );
}

export default Formulario;