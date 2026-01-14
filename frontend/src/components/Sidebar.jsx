import "../styles/Sidebar.css";

function Sidebar({ esAdmin, vistaActual, onNavegar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <p className="menu-title">MENÚ PRINCIPAL</p>
        
        <button 
            className={`menu-item ${vistaActual === "inicio" ? "active" : ""}`}
            onClick={() => onNavegar("inicio")}
        >
          🏠 Tienda
        </button>

        {esAdmin ? (
          /* --- MENÚ DE ADMINISTRADOR --- */
          <>
            <p className="menu-title">ADMINISTRACIÓN</p>
            <button 
                className={`menu-item ${vistaActual === "dashboard" ? "active" : ""}`}
                onClick={() => onNavegar("dashboard")}
            >
              📊 Dashboard
            </button>
            <button 
                className={`menu-item ${vistaActual === "productos" ? "active" : ""}`}
                onClick={() => onNavegar("productos")}
            >
              📦 Inventario
            </button>
            <button 
                className={`menu-item ${vistaActual === "ventas" ? "active" : ""}`}
                onClick={() => onNavegar("ventas")}
            >
              💰 Ventas Globales
            </button>
          </>
        ) : (
          /* --- MENÚ DE CLIENTE --- */
          <>
            <p className="menu-title">MI CUENTA</p>
            <button 
                className={`menu-item ${vistaActual === "mis-compras" ? "active" : ""}`}
                onClick={() => onNavegar("mis-compras")}
            >
              🛍️ Mis Compras
            </button>
            <button 
                className={`menu-item ${vistaActual === "perfil" ? "active" : ""}`}
                onClick={() => onNavegar("perfil")}
            >
              👤 Mi Perfil
            </button>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <p>© 2026 E-commerce</p>
      </div>
    </aside>
  );
}

export default Sidebar;