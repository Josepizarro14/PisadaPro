from flask import Flask
from app.database import db
from app.routes import cart_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@cart-db/pisadaprodb_cart"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicialización de la base de datos
    db.init_app(app)

    # Crear tablas automáticamente (solo en desarrollo o pruebas)
    with app.app_context():
        db.create_all()  # Crea todas las tablas definidas en los modelos

    # Registro de rutas
    app.register_blueprint(cart_bp, url_prefix='/cart')

    return app
