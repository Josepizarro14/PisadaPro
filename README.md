# Proyecto E-commerce PisadaPro

Este es un proyecto de e-commerce desarrollado utilizando **Flask**, **PostgreSQL** y **Docker**. El objetivo de este proyecto es proporcionar una plataforma para la gestión de clientes y ventas de zapatillas. (Se busca implementar otros frameworks, también se incluirá MongoDB)

## Tecnologías utilizadas

- **Flask**: Un microframework para Python que permite crear aplicaciones web de forma rápida y sencilla.
- **PostgreSQL**: Un sistema de gestión de bases de datos relacional que se utiliza para almacenar los datos de la aplicación.
- **Docker**: Una herramienta que permite crear, implementar y ejecutar aplicaciones en contenedores, asegurando que funcionen de manera consistente en cualquier entorno.

## Instalación y ejecución

Para ejecutar este proyecto, asegúrate de tener **Docker** instalado en tu máquina. Una vez que tengas Docker configurado, sigue estos pasos:

Ejecuta el siguiente comando para construir y ejecutar los contenedores: docker-compose up --build

Una vez que los contenedores estén en funcionamiento, abre tu navegador y dirígete a: http://localhost:5000

En caso de cualquier problema, se puede modificar el docker-compose.yml

## Estructura del proyecto
El proyecto sigue la estructura recomendada por Flask para facilitar la organización y escalabilidad del código. La estructura básica del proyecto es la siguiente:

Pisadapro
├── app/
│   ├── /templates   # Archivos HTML
│   ├── /static      # Archivos estáticos (CSS, JS, imágenes)
│   ├── app.py         # Arranque de flask
│   ├── routes.py      # Definición de las rutas de la aplicación
│   ├── models.py      # Definición de los modelos de la base de datos
│   └── __init__.py    # Inicialización de la aplicación Flask
├── docker-compose.yml  # Configuración de Docker
├── Dockerfile       # Utilización de python para descargar las librerias
└── requirements.txt # Librerias necesarias para el correcto funcionamiento
