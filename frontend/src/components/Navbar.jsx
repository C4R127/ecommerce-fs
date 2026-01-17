import "../styles/Navbar.css";

// Recibimos 'onSearch' como prop nueva
function Navbar({ usuario, onLogout, carritoCount, toggleCarrito, onSearch }) {
  const esAdmin = usuario?.rol === "ADMIN";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">🛍️</span>
        <h1>All Store</h1>
      </div>

      {/* NUEVO: BARRA DE BÚSQUEDA CENTRAL */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="🔍 Buscar productos..." 
          onChange={(e) => onSearch(e.target.value)} // Al escribir, actualizamos App.jsx
          className="search-input"
        />
      </div>

      <div className="navbar-actions">
        <div className="user-info">
          <span className="role-badge">
            {esAdmin ? "👮‍♂️ Admin" : "👤 Cliente"}
          </span>
          {/* Ocultamos el email en pantallas chicas para dar espacio a la barra */}
          <span className="user-email desktop-only">{usuario.email}</span>
        </div>

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