from flask import Flask
from .routes import load_routes  # Asegúrate de importar la función

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/pisadaprodb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    load_routes(app)  # Cargar las rutas

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
