import os
from dotenv import load_dotenv
from flask import Flask
from app.database import db
from app.routes import cart_bp
from flask_cors import CORS
from transbank.webpay.webpay_plus.transaction import Transaction


def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app, origins=os.getenv("CORS_ORIGIN", "http://localhost:3000"), supports_credentials=True)
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://user:password@cart-db/pisadaprodb_cart")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    Transaction.commerce_code = os.getenv("TRANSBANK_COMMERCE_CODE", '597055555532')
    Transaction.api_key = os.getenv("TRANSBANK_API_KEY", '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C')
    Transaction.environment = os.getenv("TRANSBANK_ENVIRONMENT", 'TEST')
    
    # Inicialización de la base de datos
    db.init_app(app)

    # Crear tablas automáticamente (solo en desarrollo o pruebas)
    with app.app_context():
        db.create_all()  # Crea todas las tablas definidas en los modelos

    # Registro de rutas
    app.register_blueprint(cart_bp, url_prefix='/cart')

    return app
