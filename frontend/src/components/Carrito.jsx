
import "../styles/Carrito.css";

function Carrito({ items, alCerrar, alEliminar , alComprar }) {
  const total = items.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div className="carrito-overlay">
      <div className="carrito-modal">
        <div className="carrito-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="btn-cerrar" onClick={alCerrar}>✖</button>
        </div>

        <div className="carrito-items">
          {items.length === 0 ? (
            <p className="vacio">Tu carrito está vacío 😢</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="item-fila">
                <img src={item.imagenUrl} alt={item.nombre} />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>${item.precio}</p>
                </div>
                {/* Botón para que el USUARIO elimine del carrito */}
                <button 
                  className="btn-quitar" 
                  onClick={() => alEliminar(index)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="carrito-footer">
          <h3>Total: ${total}</h3>
          <button 
            className="btn-pagar" 
            onClick={alComprar} // <--- AHORA EJECUTA LA COMPRA REAL
            disabled={items.length === 0} // Se desactiva si está vacío
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;