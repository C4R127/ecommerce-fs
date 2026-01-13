import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto, crearPedido, obtenerPedidos } from "./services/productoService";
import Formulario from "./components/Formulario";
import Carrito from "./components/Carrito";
import "./styles/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  
  // Estado para abrir/cerrar la ventana del carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Cada vez que cambie "esAdmin", si es true, cargamos las ventas
  useEffect(() => {
    if (esAdmin) {
      cargarPedidos();
    }
  }, [esAdmin]);

  const cargarDatos = async () => {
    const datos = await obtenerProductos();
    setProductos(datos);
  };

  const cargarPedidos = async () => {
    const datos = await obtenerPedidos();
    setPedidos(datos);
  }

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Función para quitar un ítem del carrito (solo visual, no de la BD)
  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito]; 
    nuevoCarrito.splice(index, 1);    
    setCarrito(nuevoCarrito);         
  };

  // Función para que el Admin borre un producto de la base de datos
  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto del sistema?")) {
      await eliminarProducto(id);
      cargarDatos();
    }
  };

  // Función para finalizar la compra (Enviar pedido al Backend)
  const handleComprar = async () => {
    if (carrito.length === 0) return;

    const compraExitosa = await crearPedido(carrito);
    
    if (compraExitosa) {
      alert(`¡Compra realizada con éxito! ID de pedido: ${compraExitosa.id}`);
      setCarrito([]);           // Vaciamos el carrito
      setMostrarCarrito(false); // Cerramos la ventana
    } else {
      alert("Hubo un error al procesar tu compra.");
    }
  };

  return (
    <div className="contenedor">
      {/* VENTANA DEL CARRITO (Solo se muestra si mostrarCarrito es true) */}
      {mostrarCarrito && (
        <Carrito 
          items={carrito} 
          alCerrar={() => setMostrarCarrito(false)} 
          alEliminar={eliminarDelCarrito}
          alComprar={handleComprar} /* <--- ¡AQUÍ ESTÁ LA INTEGRACIÓN! */
        />
      )}

      <header>
        <h1>🛍️ Mi Tienda</h1>
        
        <div className="panel-control">
            <button 
                className="btn-rol" 
                onClick={() => setEsAdmin(!esAdmin)}
            >
                Cambiar a: {esAdmin ? "👤 Vista Cliente" : "👮‍♂️ Vista Admin"}
            </button>

            {/* Resumen del Carrito (Solo visible para Clientes) */}
            {!esAdmin && (
                <div 
                  className="carrito-resumen" 
                  onClick={() => setMostrarCarrito(true)}
                  style={{cursor: "pointer"}}
                >
                  🛒 Carrito: <strong>{carrito.length}</strong> items
                  <br/>
                  Total: <strong>${carrito.reduce((sum, item) => sum + item.precio, 0)}</strong>
                </div>
            )}
        </div>
      </header>

      {/* Panel de Admin (Solo visible si esAdmin es true) */}
      {esAdmin && (
          <section className="seccion-admin">
            <h2 className="titulo-admin">Panel de Administración</h2>
            <Formulario alGuardar={cargarDatos} />
            <div className="historial-ventas">
              <h3>💰 Historial de Ventas</h3>
              {pedidos.length === 0 ? (
                <p>Aún no hay ventas registradas.</p>
              ) : (
                <table className="tabla-pedidos">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Productos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>#{pedido.id}</td>
                        <td>{new Date(pedido.fecha).toLocaleString()}</td>
                        <td className="total-venta">${pedido.total}</td>
                        <td>
                          <ul className="lista-items-venta">
                            {pedido.productos.map((p, index) => (
                              <li key={index}>• {p.nombre}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
      )}
      
      <hr /> 

      {/* Lista de Productos */}
      <div className="grilla-productos">
         {productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} className="tarjeta">
                 <img src={producto.imagenUrl} alt={producto.nombre} className="imagen-producto" />
                 <h3>{producto.nombre}</h3>
                 <p className="precio">${producto.precio}</p>
                 
                 <div className="acciones">
                    {esAdmin ? (
                        <>
                            <button className="btn-editar" onClick={() => alert("Próximamente: Editar")}>✏️ Editar</button>
                            <button className="btn-eliminar" onClick={() => handleEliminar(producto.id)}>🗑️ Borrar</button>
                        </>
                    ) : (
                        <button onClick={() => agregarAlCarrito(producto)}>🛒 Agregar al Carrito</button>
                    )}
                 </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
}

export default App;