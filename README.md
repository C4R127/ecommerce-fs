# 🛒 E-commerce Full Stack System

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Un sistema completo de comercio electrónico desarrollado como proyecto Full Stack. La aplicación permite la gestión de inventario, visualización de productos, carrito de compras y administración de pedidos, integrando una API externa para la carga masiva de datos.

## 📸 Capturas de Pantalla

| Vista de Catálogo (Cliente) | Panel de Administración |
|:---------------------------:|:-----------------------:|
| ![Catalogo](/screenshots/catalogo.png) | ![Dashboard](/screenshots/dashboard.png) |
| *Filtrado por categorías y búsqueda* | *Estadísticas y gestión de inventario* |

> *Nota: Asegúrate de reemplazar `/screenshots/catalogo.png` con la ruta real de tus imágenes.*

## 🚀 Características Principales

### 👤 Cliente
* **Catálogo Dinámico:** Visualización de productos con imágenes, precios y categorías.
* **Filtros Inteligentes:** Búsqueda por nombre y filtrado por categorías (generadas dinámicamente).
* **Vista de Detalle:** Información ampliada del producto al hacer clic.
* **Carrito de Compras:** Gestión de estado local para agregar/eliminar productos y calcular total.
* **Simulación de Compra:** Flujo completo de pedido registrado en base de datos.

### 👮 Administrador
* **Dashboard Interactivo:** Métricas clave (Ingresos totales, Pedidos realizados, Productos activos).
* **Gestión de Inventario (CRUD):** Crear, Editar y Eliminar productos.
* **Soft Delete (Eliminado Lógico):** Sistema para deshabilitar productos sin romper el historial de ventas.
* **Importación Masiva:** Integración con **DummyJSON API** para poblar la base de datos con 100 productos reales automáticamente.
* **Reporte de Ventas:** Tabla detallada de transacciones.

## 🛠️ Tecnologías Utilizadas

### Backend
* **Java 17+**
* **Spring Boot 3:** Framework principal.
* **Spring Data JPA (Hibernate):** Para la persistencia de datos.
* **MySQL Driver:** Conexión a base de datos.
* **Lombok:** Reducción de código repetitivo (Boilerplate).

### Frontend
* **React.js (Vite):** Librería de UI rápida y moderna.
* **CSS Puro:** Diseño personalizado y responsivo (Flexbox/Grid).
* **Fetch API:** Consumo de endpoints REST.

### Base de Datos
* **MySQL:** Base de datos relacional.
* **Modelo Entidad-Relación:** Tablas normalizadas (`usuario`, `producto`, `pedido`, `pedido_productos`).

## ⚙️ Instalación y Configuración

Sigue estos pasos para correr el proyecto en tu máquina local:

### 1. Base de Datos
Crea una base de datos vacía en MySQL:


'CREATE DATABASE ecommerce_db;'


## 2. Backend (Spring Boot)
Clona el repositorio.

Abre la carpeta backend en IntelliJ IDEA o tu IDE preferido.

Configura el archivo src/main/resources/application.properties:

~~~
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=TU_USUARIO_MYSQL
spring.datasource.password=TU_CONTRASEÑA
spring.jpa.hibernate.ddl-auto=update
~~~

## 3. Frontend (React)
1. Abre una terminal en la carpeta frontend.

2. Instala las dependencias:

~~~
npm install
~~~

3. Inicia el servidor de desarrollo:

~~~
npm run dev
~~~

4. Abre tu navegador en http://localhost:5173.

## 📡 Endpoints Principales (API REST)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| GET | api/productos | Obtener todos los productos |
| POST | /api/productos | Crear nuevo producto |
| PUT | /api/productos/{id}/estado | Activar/Desactivar producto (Soft Delete) |
| POST | /api/productos/importar | Importar datos desde DummyJSON |
| POST | /api/pedidos | Crear una nueva orden de compra |

## 🌟 Futuras Mejoras
* [ ] Integración de pasarela de pagos real (PayPal/Stripe).

* [ ] Autenticación segura con JWT y Spring Security.

* [ ] Registro de usuarios para clientes nuevos.

* [ ] Despliegue en la nube (AWS/Render).

## ✒️ Autor

Carlos Eduardo Barra Cconcho

