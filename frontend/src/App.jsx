import { useEffect, useState } from "react";
// IMPORTANTE: Agregamos 'importarProductosDemo' a los imports
import { obtenerProductos, eliminarProducto, crearPedido, obtenerPedidos, importarProductosDemo } from "./services/productoService";
import Formulario from "./components/Formulario";
import Carrito from "./components/Carrito";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./styles/App.css";

function App() {
  const [usuario, setUsuario] = useState(null);
  
  // --- ESTADOS ---
  const [vista, setVista] = useState("inicio"); 
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState(""); 

  const esAdmin = usuario?.rol === "ADMIN";

  useEffect(() => {
    if (usuario) {
      cargarDatos();    
      cargarPedidos();  
    }
  }, [usuario]); 

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- FUNCIONES ---
  const cargarDatos = async () => {
    const datos = await obtenerProductos();
    setProductos(datos || []); 
  };
  
  const cargarPedidos = async () => {
    const datos = await obtenerPedidos();
    setPedidos(datos || []); 
  };

  const agregarAlCarrito = (producto) => setCarrito([...carrito, producto]);
  
  const eliminarDelCarrito = (index) => {
    const nuevo = [...carrito]; nuevo.splice(index, 1); setCarrito(nuevo); 
  };

  const handleEliminar = async (id) => {
    if(window.confirm("¿Borrar producto?")) { await eliminarProducto(id); cargarDatos(); }
  };
  
  const handleEditar = (p) => { 
      setProductoEditando(p); 
      setVista("productos");
      document.querySelector('.contenido-pagina')?.scrollTo({top:0, behavior:'smooth'}); 
  };
  
  const cancelarEdicion = () => setProductoEditando(null);

  // --- NUEVA FUNCIÓN: IMPORTAR PRODUCTOS DEMO ---
  const handleImportar = async () => {
    if(window.confirm("¿Quieres descargar productos de prueba? Esto se agregará a tu lista actual.")) {
        const mensaje = await importarProductosDemo();
        alert(mensaje);
        cargarDatos(); // Recargar la lista para ver los nuevos productos
    }
  };

  const handleComprar = async () => {
    if (carrito.length === 0) return;
    const exito = await crearPedido(carrito, usuario);
    if (exito) { 
        alert(`¡Pedido #${exito.id} creado!`); setCarrito([]); setMostrarCarrito(false); 
        if (esAdmin) cargarPedidos();
    } else { alert("Error en compra"); }
  };

  const handleLogout = () => {
      setUsuario(null); setCarrito([]); setPedidos([]); setVista("inicio"); setBusqueda("");
  };

  if (!usuario) return <Login alIngresar={setUsuario} />;

  // --- RENDERIZADO ---
  return (
    <div className="app-layout">
      <Navbar 
        usuario={usuario} 
        onLogout={handleLogout} 
        carritoCount={carrito.length}
        toggleCarrito={() => setMostrarCarrito(true)}
        onSearch={setBusqueda} 
      />

      <div className="main-content-wrapper">
        
        <Sidebar 
          esAdmin={esAdmin} 
          vistaActual={vista}        
          onNavegar={(v) => setVista(v)} 
        />

        <main className="contenido-pagina">
            {mostrarCarrito && (
                <Carrito items={carrito} alCerrar={() => setMostrarCarrito(false)} alEliminar={eliminarDelCarrito} alComprar={handleComprar}/>
            )}

            {/* VISTA: GESTIÓN DE PRODUCTOS (Solo Admin) */}
            {esAdmin && vista === "productos" && (
                <section className="seccion-admin">
                    {/* ENCABEZADO CON BOTÓN IMPORTAR (Estilos en CSS) */}
                    <div className="admin-header">
                        <h2 className="titulo-admin">📦 Gestión de Inventario</h2>
                        
                        <button 
                            onClick={handleImportar}
                            className="btn-importar"
                        >
                            ☁️ Importar Demo
                        </button>
                    </div>
                    
                    <hr className="admin-divider"/>

                    <Formulario 
                        alGuardar={cargarDatos} 
                        productoEditando={productoEditando} 
                        alCancelar={cancelarEdicion}
                    />
                    
                    {/* GRILLA DE PRODUCTOS (Para ver lo que administras) */}
                    <div style={{marginTop: "30px"}}>
                         {/* Se reutiliza la visualización de abajo, o podrías pegar una tabla aquí si prefieres */}
                    </div>
                </section>
            )}

            {/* VISTA: VENTAS (Solo Admin) */}
            {esAdmin && vista === "ventas" && (
                <section className="seccion-admin">
                    <h2 className="titulo-admin">💰 Reporte de Ventas</h2>
                    <div className="historial-ventas">
                        {(!pedidos || pedidos.length === 0) ? (
                            <p>No hay ventas registradas.</p>
                        ) : (
                            <table className="tabla-pedidos">
                                <thead>
                                    <tr><th>ID</th><th>Fecha</th><th>Comprador</th><th>Total</th><th>Detalle</th></tr>
                                </thead>
                                <tbody>
                                    {(pedidos || []).map(p => (
                                        <tr key={p.id}>
                                            <td>#{p.id}</td>
                                            <td>{p.fecha ? new Date(p.fecha).toLocaleDateString() : "-"}</td>
                                            <td style={{color: "#2980b9", fontWeight:"bold"}}>{p.usuario ? p.usuario.email : "Anónimo"}</td>
                                            <td className="total-venta">${p.total}</td>
                                            <td><small>{p.productos.length} items</small></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            )}

            {/* VISTA: DASHBOARD (Solo Admin) */}
            {esAdmin && vista === "dashboard" && (
                <section className="seccion-admin">
                    <h2 className="titulo-admin">📊 Resumen del Negocio</h2>
                    <div className="dashboard-stats" style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px"}}>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #27ae60"}}>
                            <h3 style={{fontSize: "0.9rem", color: "#7f8c8d", margin: 0}}>Ingresos Totales</h3>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>
                                ${pedidos.reduce((total, pedido) => total + pedido.total, 0)}
                            </p>
                            <small style={{color: "#27ae60"}}>💰 Dinero real en caja</small>
                        </div>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #3498db"}}>
                            <h3 style={{fontSize: "0.9rem", color: "#7f8c8d", margin: 0}}>Pedidos Realizados</h3>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>
                                {pedidos.length}
                            </p>
                            <small style={{color: "#3498db"}}>🛒 Ventas cerradas</small>
                        </div>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #f39c12"}}>
                            <h3 style={{fontSize: "0.9rem", color: "#7f8c8d", margin: 0}}>Productos Activos</h3>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>
                                {productos.length}
                            </p>
                            <small style={{color: "#f39c12"}}>📦 En catálogo</small>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA: INICIO / CATÁLOGO */}
            {(vista === "inicio" || vista === "productos") && (
                <>
                    {vista === "inicio" && <h2 className="titulo-admin">🏠 Catálogo de Productos</h2>}
                    
                    <div className="grilla-productos">
                        {(!productosFiltrados || productosFiltrados.length === 0) ? (
                            <div style={{textAlign: "center", width: "100%", color: "#7f8c8d"}}>
                                <h2>
                                    {busqueda ? "🔍 No se encontraron productos" : "🤷‍♂️ Catálogo Vacío"}
                                </h2>
                            </div>
                        ) : (
                            (productosFiltrados || []).map((producto) => (
                            <div key={producto.id} className="tarjeta">
                                <img src={producto.imagenUrl || "https://via.placeholder.com/150"} alt={producto.nombre} className="imagen-producto" />
                                <h3>{producto.nombre}</h3>
                                <p className="precio">${producto.precio}</p>
                                <div className="acciones">
                                    {esAdmin && vista === "productos" ? (
                                        <>
                                            <button className="btn-editar" onClick={() => handleEditar(producto)}>✏️</button>
                                            <button className="btn-eliminar" onClick={() => handleEliminar(producto.id)}>🗑️</button>
                                        </>
                                    ) : (
                                        <button onClick={() => agregarAlCarrito(producto)}>🛒 Agregar</button>
                                    )}
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* VISTAS DE CLIENTE */}
            {!esAdmin && vista === "mis-compras" && (
                <section>
                    <h2 className="titulo-admin">🛍️ Historial de Compras</h2>
                    <div className="historial-ventas">
                        {pedidos.filter(p => p.usuario?.id === usuario.id).length === 0 ? (
                            <div style={{textAlign: "center", padding: "40px"}}>
                                <h3>Aún no has comprado nada.</h3>
                            </div>
                        ) : (
                            <table className="tabla-pedidos">
                                <thead><tr><th>Pedido #</th><th>Fecha</th><th>Total</th><th>Productos</th></tr></thead>
                                <tbody>
                                    {pedidos.filter(p => p.usuario?.id === usuario.id).map(p => (
                                        <tr key={p.id}>
                                            <td>#{p.id}</td>
                                            <td>{new Date(p.fecha).toLocaleDateString()}</td>
                                            <td className="total-venta">${p.total}</td>
                                            <td>
                                                <ul className="lista-items-venta">
                                                    {p.productos.map((prod, i) => <li key={i}>• {prod.nombre}</li>)}
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

            {!esAdmin && vista === "perfil" && (
                <section style={{display: "flex", justifyContent: "center"}}>
                    <div style={{background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px", width: "100%"}}>
                        <div style={{fontSize: "4rem", marginBottom: "10px"}}>👤</div>
                        <h2 style={{color: "#2c3e50", margin: "0"}}>{usuario.nombre}</h2>
                        <p style={{color: "#7f8c8d", marginBottom: "20px"}}>{usuario.email}</p>
                        <div style={{background: "#f1f2f6", padding: "15px", borderRadius: "10px", textAlign: "left"}}>
                            <p><strong>Rol:</strong> Cliente</p>
                            <p><strong>Miembro desde:</strong> 2026</p>
                            <p><strong>Estado:</strong> Activo ✅</p>
                        </div>
                    </div>
                </section>
            )}

        </main>
      </div>
    </div>
  );
}

export default App;