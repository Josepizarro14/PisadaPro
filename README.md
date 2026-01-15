# PisadaPro

Proyecto de **Aplicaciones de Internet** desarrollado como parte de la carrera **Ingeniería en Computación**.

PisadaPro es una aplicación de comercio electrónico implementada usando una **arquitectura de microservicios**, con el objetivo de aplicar conceptos vistos en el ramo como desarrollo backend, consumo de APIs, bases de datos, contenedores y comunicación entre servicios.

## Arquitectura

El proyecto está compuesto por varios servicios independientes, los cuales se ejecutan y se comunican entre sí mediante **Docker Compose**.

### Frontend (`/frontend`)
- **Tecnología:** React  
- **Descripción:** Interfaz web de la aplicación. Permite visualizar productos, navegar por el catálogo y gestionar el carrito de compras.  
- Se comunica con los servicios backend mediante APIs REST.

### Servicio de Usuarios (`/user-service`)
- **Tecnología:** Python (Flask)  
- **Base de datos:** PostgreSQL  
- **Descripción:** Maneja el registro, autenticación y la información básica de los usuarios.

### Servicio de Productos (`/product-service`)
- **Tecnología:** Node.js (Express)  
- **Base de datos:** MongoDB  
- **Descripción:** Gestiona la información de los productos disponibles en la tienda (crear, obtener y actualizar productos).

### Servicio de Catálogo (`/catalog-service`)
- **Tecnología:** Node.js (Express)  
- **Base de datos:** MongoDB  
- **Descripción:** Se encarga de la organización del catálogo, permitiendo búsquedas y filtrado de productos.

### Servicio de Carrito (`/cart-service`)
- **Tecnología:** Python (Flask)  
- **Descripción:** Maneja el carrito de compras del usuario, permitiendo agregar y eliminar productos de forma temporal.

## Requisitos

Para ejecutar el proyecto de forma local es necesario tener instalado:

- Docker  
- Docker Compose  

## Ejecución del proyecto

Clonar el repositorio:

```bash
git clone https://github.com/josepizarro14/pisadapro.git
cd pisadapro
```

Levantar los servicios:

```bash
docker-compose up --build
```

Una vez levantados los contenedores, la aplicación estará disponible en:
```bash
Frontend: http://localhost:3000 (o el puerto definido en docker-compose.yml)
```

## Estructura del proyecto
```bash
pisadapro/
├── cart-service/        # Microservicio de carrito (Flask)
├── catalog-service/     # Microservicio de catálogo (Express)
├── frontend/            # Frontend en React
├── product-service/     # Microservicio de productos (Express)
├── user-service/        # Microservicio de usuarios (Flask)
├── docker-compose.yml   # Orquestación de servicios
└── README.md

```

## Notas

- Proyecto desarrollado con fines académicos.

- No está pensado para un entorno productivo.

- El foco principal fue la correcta separación de servicios y la comunicación entre ellos.
