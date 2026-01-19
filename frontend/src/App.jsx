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
  
  // Estados nuevos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const esAdmin = usuario?.rol === "ADMIN";

  useEffect(() => {
    if (usuario) {
      cargarDatos();    
      cargarPedidos();  
    }
  }, [usuario]); 

  // --- LÓGICA DE CATEGORÍAS ---
  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria).filter(c => c))];

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter((producto) => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const esVisible = esAdmin ? true : (producto.activo !== false);
      const coincideCategoria = categoriaSeleccionada === "Todas" || producto.categoria === categoriaSeleccionada;
      return coincideBusqueda && esVisible && coincideCategoria;
  });

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
    if(window.confirm("¿Quieres descargar productos de prueba? Esto borrará los actuales.")) {
        // Opcional: Podrías llamar a limpiarVentas() antes si quisieras borrar todo
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

  // Función para ver detalle
  const verDetalle = (producto) => {
    setProductoSeleccionado(producto);
    setVista("detalle");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNavegar = (v) => {
      setVista(v);
      setProductoSeleccionado(null);
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
        <Sidebar esAdmin={esAdmin} vistaActual={vista} onNavegar={handleNavegar} />

        <main className="contenido-pagina">
            {mostrarCarrito && (
                <Carrito items={carrito} alCerrar={() => setMostrarCarrito(false)} alEliminar={eliminarDelCarrito} alComprar={handleComprar}/>
            )}

            {/* VISTA: DETALLE DE PRODUCTO */}
            {vista === "detalle" && productoSeleccionado && (
                <section className="detalle-producto-container" style={{padding: "20px"}}>
                    <button onClick={() => setVista("inicio")} style={{marginBottom: "20px", background:"transparent", color:"#333", border:"1px solid #ccc", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}>
                        ⬅ Volver al catálogo
                    </button>
                    
                    <div style={{display: "flex", flexWrap: "wrap", gap: "40px", background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)"}}>
                        <div style={{flex: "1", minWidth: "300px"}}>
                            <img 
                                src={productoSeleccionado.imagenUrl} 
                                alt={productoSeleccionado.nombre} 
                                style={{width: "100%", borderRadius: "10px", objectFit: "contain", maxHeight: "400px"}} 
                            />
                        </div>

                        <div style={{flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <small style={{color: "#888", textTransform: "uppercase", letterSpacing: "1px"}}>{productoSeleccionado.categoria}</small>
                            <h1 style={{fontSize: "2.5rem", margin: "10px 0", color: "#2c3e50"}}>{productoSeleccionado.nombre}</h1>
                            <p style={{fontSize: "2rem", color: "#27ae60", fontWeight: "bold", margin: "10px 0"}}>${productoSeleccionado.precio}</p>
                            
                            <hr style={{border: "0", borderTop: "1px solid #eee", margin: "20px 0"}}/>
                            
                            <h3 style={{color: "#555"}}>Descripción:</h3>
                            <p style={{lineHeight: "1.6", color: "#666", fontSize: "1.1rem"}}>
                                {productoSeleccionado.descripcion || "Este producto no tiene descripción detallada."}
                            </p>

                            <div style={{marginTop: "30px"}}>
                                {!esAdmin && (
                                    <button 
                                        onClick={() => { agregarAlCarrito(productoSeleccionado); alert("Añadido al carrito"); }}
                                        style={{padding: "15px 30px", fontSize: "1.1rem", background: "#3498db", color: "white", border: "none", borderRadius: "8px", cursor: "pointer"}}
                                    >
                                        🛒 Añadir al Carrito
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
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

            {/* VISTA: INICIO / CATÁLOGO / INVENTARIO */}
            {(vista === "inicio" || vista === "productos") && (
                <>
                    {vista === "inicio" && <h2 className="titulo-admin">🏠 Catálogo de Productos</h2>}
                    
                    {/* BARRA DE CATEGORÍAS */}
                    {productos.length > 0 && (
                        <div className="categorias-container">
                            {categorias.map((cat, index) => (
                                <button
                                    key={index}
                                    className={`btn-categoria ${categoriaSeleccionada === cat ? "active" : ""}`}
                                    onClick={() => setCategoriaSeleccionada(cat)}
                                >
                                    {cat === "Todas" ? "🔍 Todas" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* GRILLA DE PRODUCTOS (¡Ahora con botones!) */}
                    <div className="grilla-productos">
                        {(!productosFiltrados || productosFiltrados.length === 0) ? (
                            <div style={{textAlign: "center", width: "100%", color: "#7f8c8d", marginTop: "40px"}}>
                                <h2>{busqueda ? "🔍 No hay resultados" : "🤷‍♂️ No hay productos"}</h2>
                            </div>
                        ) : (
                            (productosFiltrados || []).map((producto) => (
                            <div key={producto.id} className="tarjeta" style={{ opacity: (producto.activo === false) ? 0.6 : 1 }}>
                                <img 
                                    src={producto.imagenUrl || "https://via.placeholder.com/150"} 
                                    alt={producto.nombre} 
                                    className="imagen-producto" 
                                    style={{cursor: "pointer"}}
                                    onClick={() => verDetalle(producto)} // Clic para ver detalle
                                />
                                
                                <h3>{producto.nombre} {producto.activo === false && <span style={{color: "red", fontSize:"0.8rem"}}> (Inactivo)</span>}</h3>
                                <p className="precio">${producto.precio}</p>
                                
                                <div style={{fontSize: "0.8rem", color: "#888", marginBottom: "10px", fontStyle: "italic"}}>
                                    {producto.categoria || "General"}
                                </div>

                                {/* AQUÍ ESTÁN LOS BOTONES RESTAURADOS */}
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
                                        // Si es cliente o Admin en vista 'inicio', mostramos comprar
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
                        <div style={{background: "#f1f2f6", padding: "15px", borderRadius: "10px", textAlign: "left", marginTop: "20px"}}>
                            <p><strong>Rol:</strong> Cliente</p>
                            <p><strong>Miembro desde:</strong> 2026</p>
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