# Dockerfile para frontend

FROM node:18

# Cambia el directorio de trabajo al de la interfaz
WORKDIR /app

# Copiar los archivos necesarios de la interfaz
COPY interfaz/package.json interfaz/package-lock.json ./

# Instalar dependencias
RUN npm install

RUN npm install react-router-dom

# Copiar el resto del código de la aplicación
COPY interfaz .

# Habilitar polling para cambios en archivos
ENV WATCHPACK_POLLING=true

# Exponer el puerto y arrancar la aplicación
EXPOSE 3000
CMD ["npm", "run", "start-watch"]
