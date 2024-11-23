from flask import Flask
from app.database import db
from app.routes import cart_bp
from flask_cors import CORS
from transbank.webpay.webpay_plus.transaction import Transaction


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@cart-db/pisadaprodb_cart"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    Transaction.commerce_code = 'YOUR_COMMERCE_CODE'
    Transaction.api_key = 'YOUR_API_KEY'
    Transaction.environment = 'TEST'  # Cambia a 'PRODUCTION' en producción
    
    # Inicialización de la base de datos
    db.init_app(app)

    # Crear tablas automáticamente (solo en desarrollo o pruebas)
    with app.app_context():
        db.create_all()  # Crea todas las tablas definidas en los modelos

    # Registro de rutas
    app.register_blueprint(cart_bp, url_prefix='/cart')

    return app
