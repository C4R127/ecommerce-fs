import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto, crearPedido, obtenerPedidos, importarProductosDemo, toggleEstadoProducto } from "./services/productoService";
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
  
  // --- NUEVO: Estado para la categoría seleccionada ---
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  const esAdmin = usuario?.rol === "ADMIN";

  useEffect(() => {
    if (usuario) {
      cargarDatos();    
      cargarPedidos();  
    }
  }, [usuario]); 

  // --- NUEVO: Extraer categorías únicas dinámicamente ---
  // 1. Obtenemos todas las categorías (p.categoria)
  // 2. Usamos 'new Set' para eliminar duplicados
  // 3. Agregamos "Todas" al principio
  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria).filter(c => c))];

  // --- LÓGICA DE FILTRADO MEJORADA (Ahora con Categorías) ---
  const productosFiltrados = productos.filter((producto) => {
      // 1. Filtro por texto (Buscador)
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
      
      // 2. Filtro por Estado (Soft Delete)
      const esVisible = esAdmin ? true : (producto.activo !== false);

      // 3. Filtro por Categoría (NUEVO)
      const coincideCategoria = categoriaSeleccionada === "Todas" || producto.categoria === categoriaSeleccionada;

      return coincideBusqueda && esVisible && coincideCategoria;
  });

  // --- FUNCIONES (Igual que antes) ---
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

  const handleToggleEstado = async (id) => {
      await toggleEstadoProducto(id);
      cargarDatos(); 
  };
  
  const handleEditar = (p) => { 
      setProductoEditando(p); 
      setVista("productos");
      document.querySelector('.contenido-pagina')?.scrollTo({top:0, behavior:'smooth'}); 
  };
  
  const cancelarEdicion = () => setProductoEditando(null);

  const handleImportar = async () => {
    if(window.confirm("¿Quieres descargar productos de prueba? Esto se agregará a tu lista actual.")) {
        const mensaje = await importarProductosDemo();
        alert(mensaje);
        cargarDatos(); 
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
        <Sidebar esAdmin={esAdmin} vistaActual={vista} onNavegar={(v) => setVista(v)} />

        <main className="contenido-pagina">
            {mostrarCarrito && (
                <Carrito items={carrito} alCerrar={() => setMostrarCarrito(false)} alEliminar={eliminarDelCarrito} alComprar={handleComprar}/>
            )}

            {/* VISTA: GESTIÓN DE PRODUCTOS (Solo Admin) */}
            {esAdmin && vista === "productos" && (
                <section className="seccion-admin">
                    <div className="admin-header">
                        <h2 className="titulo-admin">📦 Gestión de Inventario</h2>
                        <button onClick={handleImportar} className="btn-importar">☁️ Importar Demo</button>
                    </div>
                    <hr className="admin-divider"/>
                    <Formulario alGuardar={cargarDatos} productoEditando={productoEditando} alCancelar={cancelarEdicion}/>
                    <div style={{marginTop: "30px"}}></div>
                </section>
            )}

            {/* VISTA: VENTAS (Solo Admin) */}
            {esAdmin && vista === "ventas" && (
                <section className="seccion-admin">
                    <h2 className="titulo-admin">💰 Reporte de Ventas</h2>
                    {/* ... (Tu tabla de ventas sigue igual, la omito para ahorrar espacio visual, pégala aquí si la borraste) ... */}
                     <div className="historial-ventas">
                        {(!pedidos || pedidos.length === 0) ? (
                            <p>No hay ventas registradas.</p>
                        ) : (
                            <table className="tabla-pedidos">
                                <thead><tr><th>ID</th><th>Fecha</th><th>Comprador</th><th>Total</th><th>Detalle</th></tr></thead>
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
                     {/* ... (Tus tarjetas del dashboard siguen igual) ... */}
                     <div className="dashboard-stats" style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px"}}>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #27ae60"}}>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>${pedidos.reduce((total, pedido) => total + pedido.total, 0)}</p>
                            <small>💰 Ingresos</small>
                        </div>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #3498db"}}>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>{pedidos.length}</p>
                            <small>🛒 Pedidos</small>
                        </div>
                        <div className="stat-card" style={{background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: "5px solid #f39c12"}}>
                            <p style={{fontSize: "2rem", fontWeight: "bold", color: "#2c3e50", margin: "10px 0"}}>{productos.length}</p>
                            <small>📦 Productos</small>
                        </div>
                    </div>
                </section>
            )}

            {/* VISTA: INICIO / CATÁLOGO / INVENTARIO (Aquí mostramos la barra) */}
            {(vista === "inicio" || vista === "productos") && (
                <>
                    {vista === "inicio" && <h2 className="titulo-admin">🏠 Catálogo de Productos</h2>}
                    
                    {/* --- NUEVO: BARRA DE CATEGORÍAS --- */}
                    {/* Solo la mostramos si hay productos */}
                    {productos.length > 0 && (
                        <div className="categorias-container">
                            {categorias.map((cat, index) => (
                                <button
                                    key={index}
                                    className={`btn-categoria ${categoriaSeleccionada === cat ? "active" : ""}`}
                                    onClick={() => setCategoriaSeleccionada(cat)}
                                >
                                    {/* Si es "Todas", ponemos un icono, si no, capitalizamos la primera letra */}
                                    {cat === "Todas" ? "🔍 Todas" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grilla-productos">
                        {(!productosFiltrados || productosFiltrados.length === 0) ? (
                            <div style={{textAlign: "center", width: "100%", color: "#7f8c8d", marginTop: "40px"}}>
                                <h2>{busqueda ? "🔍 No hay resultados" : "🤷‍♂️ No hay productos en esta categoría"}</h2>
                            </div>
                        ) : (
                            (productosFiltrados || []).map((producto) => (
                            <div key={producto.id} className="tarjeta" style={{ opacity: (producto.activo === false) ? 0.6 : 1 }}>
                                <img src={producto.imagenUrl || "https://via.placeholder.com/150"} alt={producto.nombre} className="imagen-producto" />
                                <h3>{producto.nombre} {producto.activo === false && <span style={{color: "red", fontSize:"0.8rem"}}> (Inactivo)</span>}</h3>
                                <p className="precio">${producto.precio}</p>
                                
                                {/* Etiqueta de Categoría pequeña dentro de la tarjeta */}
                                <div style={{fontSize: "0.8rem", color: "#888", marginBottom: "10px", fontStyle: "italic"}}>
                                    {producto.categoria || "Sin categoría"}
                                </div>

                                <div className="acciones">
                                    {esAdmin && vista === "productos" ? (
                                        <>
                                            <button className="btn-editar" onClick={() => handleEditar(producto)}>✏️</button>
                                            <button 
                                                onClick={() => handleToggleEstado(producto.id)}
                                                style={{background: (producto.activo === false) ? "#27ae60" : "#7f8c8d", color: "white"}}
                                            >
                                                {producto.activo === false ? "✅" : "🚫"}
                                            </button>
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
                    {/* ... (Tu tabla de compras sigue igual) ... */}
                    <div className="historial-ventas">
                        {pedidos.filter(p => p.usuario?.id === usuario.id).length === 0 ? (
                            <div style={{textAlign: "center", padding: "40px"}}><h3>Aún no has comprado nada.</h3></div>
                        ) : (
                             <table className="tabla-pedidos">
                                <thead><tr><th>Pedido #</th><th>Fecha</th><th>Total</th></tr></thead>
                                <tbody>
                                    {pedidos.filter(p => p.usuario?.id === usuario.id).map(p => (
                                        <tr key={p.id}><td>#{p.id}</td><td>{new Date(p.fecha).toLocaleDateString()}</td><td className="total-venta">${p.total}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            )}
            
            {!esAdmin && vista === "perfil" && (
                <section style={{display: "flex", justifyContent: "center"}}>
                     <div style={{background: "white", padding: "40px", borderRadius: "20px", textAlign: "center", maxWidth: "400px"}}>
                        <div style={{fontSize: "4rem"}}>👤</div>
                        <h2>{usuario.nombre}</h2>
                        <p>{usuario.email}</p>
                     </div>
                </section>
            )}

        </main>
      </div>
    </div>
  );
}

export default App;