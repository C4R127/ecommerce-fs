const API_URL = "http://localhost:8080/api/productos";
const API_PEDIDOS = "http://localhost:8080/api/pedidos";

// 1. Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return [];
  }
};

// 2. Crear un nuevo producto (Admin)
export const crearProducto = async (producto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    
    if (!response.ok) throw new Error("Error al guardar");
    return await response.json();
  } catch (error) {
    console.error("Error creando producto:", error);
    return null;
  }
};

// 3. Actualizar producto (Admin)
export const actualizarProducto = async (id, producto) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });

    if (!response.ok) throw new Error("Error al actualizar");
    return await response.json();
  } catch (error) {
    console.error("Error actualizando:", error);
    return null;
  }
};

// 4. Eliminar producto (Borrado Físico)
export const eliminarProducto = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error eliminando:", error);
    return false;
  }
};

// 5. Cambiar estado Activo/Inactivo (Borrado Lógico)
export const toggleEstadoProducto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/estado`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    console.error("Error cambiando estado:", error);
    return null;
  }
};

// 6. Importar productos de demo (DummyJSON)
export const importarProductosDemo = async () => {
  try {
    const response = await fetch(`${API_URL}/importar`, {
      method: "POST",
    });
    // Este endpoint devuelve texto plano, no JSON
    return await response.text(); 
  } catch (error) {
    console.error("Error importando:", error);
    return null;
  }
};

// 7. Crear Pedido (Compra)
export const crearPedido = async (carrito, usuario) => {
  try {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    const pedido = {
        total: total,
        productos: carrito,
        usuario: { id: usuario.id } // Vinculamos con el ID del usuario
    };

    const response = await fetch(API_PEDIDOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (!response.ok) throw new Error("Error al procesar compra");
    return await response.json();
  } catch (error) {
    console.error("Error en la compra:", error);
    return null;
  }
};

// 8. Obtener historial de pedidos
export const obtenerPedidos = async () => {
  try {
    const response = await fetch(API_PEDIDOS);
    if (!response.ok) throw new Error("Error al obtener pedidos");
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return [];
  }
};