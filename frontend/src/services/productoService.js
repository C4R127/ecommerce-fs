const API_URL = "http://localhost:8080/api/productos";

export const obtenerProductos = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return [];
  }
};

// Función para crear un nuevo producto (usada por el Admin)

export const crearProducto = async (producto) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST", // Indicamos que vamos a GUARDAR
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto), // Convertimos los datos a texto JSON
    });
    
    if (!response.ok) throw new Error("Error al guardar");
    return await response.json(); // Devolvemos el producto creado
  } catch (error) {
    console.error("Error creando producto:", error);
    return null;
  }
};

export const eliminarProducto = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true; // Éxito
  } catch (error) {
    console.error("Error eliminando:", error);
    return false; // Fallo
  }
};

const API_PEDIDOS = "http://localhost:8080/api/pedidos";

export const crearPedido = async (carrito) => {
  try {
    // Calculamos el total aquí o enviamos lo que tenemos
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    // Armamos el paquete que espera Java
    const pedido = {
        total: total,
        productos: carrito // Enviamos la lista completa de productos
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

// Función para obtener el historial de pedidos

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