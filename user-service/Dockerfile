# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de dependencias e instálalas
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto en el que Flask correrá
EXPOSE 5000

# Define el comando para ejecutar la aplicación
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
