import { useState } from "react";
import { login, registrar } from "../services/usuarioService";
import "../styles/Login.css"; // Ahora crearemos este estilo

function Login({ alIngresar }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (esRegistro) {
      // --- REGISTRO ---
      const nuevoUsuario = await registrar({ nombre, email, password });
      if (nuevoUsuario) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        setEsRegistro(false); // Lo mandamos al login
      } else {
        alert("Error al registrar. Quizás el correo ya existe.");
      }
    } else {
      // --- LOGIN ---
      const usuarioEncontrado = await login(email, password);
      if (usuarioEncontrado) {
        alIngresar(usuarioEncontrado); // ¡ÉXITO! Pasamos el usuario a App.jsx
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{esRegistro ? "📝 Crear Cuenta" : "🔐 Iniciar Sesión"}</h2>
        
        <form onSubmit={handleSubmit}>
          {esRegistro && (
            <input 
              type="text" placeholder="Tu Nombre" 
              value={nombre} onChange={(e) => setNombre(e.target.value)} required 
            />
          )}
          
          <input 
            type="email" placeholder="Correo Electrónico" 
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          
          <input 
            type="password" placeholder="Contraseña" 
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />

          <button type="submit" className="btn-login">
            {esRegistro ? "Registrarse" : "Entrar"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setEsRegistro(!esRegistro)}>
          {esRegistro 
            ? "¿Ya tienes cuenta? Inicia Sesión" 
            : "¿Eres nuevo? Regístrate aquí"}
        </p>
      </div>
    </div>
  );
}

export default Login;