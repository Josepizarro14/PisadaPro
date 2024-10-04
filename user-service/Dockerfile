# Dockerfile

FROM python:3.9-slim

WORKDIR /app

# Copiar el archivo de dependencias
COPY requirements.txt requirements.txt

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Establecer FLASK_APP y activar modo debug
ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

# Ejecutar Flask
CMD ["flask", "run", "--host=0.0.0.0"]