import "../styles/Navbar.css"; // Crearemos este estilo en el paso 3

function Navbar({ usuario, onLogout, carritoCount, toggleCarrito }) {
  const esAdmin = usuario?.rol === "ADMIN";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">🛍️</span>
        <h1>Tienda de {usuario.nombre}</h1>
      </div>

      <div className="navbar-actions">
        <div className="user-info">
          <span className="role-badge">
            {esAdmin ? "👮‍♂️ Admin" : "👤 Cliente"}
          </span>
          <span className="user-email">{usuario.email}</span>
        </div>

        {/* Solo mostramos el carrito si NO es admin */}
        {!esAdmin && (
          <button className="btn-icon" onClick={toggleCarrito}>
            🛒 <span className="badge">{carritoCount}</span>
          </button>
        )}

        <button className="btn-logout" onClick={onLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}

export default Navbar;