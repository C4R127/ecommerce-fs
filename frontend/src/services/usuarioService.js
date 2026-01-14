const API_URL = "http://localhost:8080/api/usuarios";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const usuario = await response.json();
    // Si usuario es null, es que falló el login
    return usuario; 
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
};

export const registrar = async (datos) => {
  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await response.json();
  } catch (error) {
    console.error("Error en registro:", error);
    return null;
  }
};