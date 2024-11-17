from flask import Flask
from flask_migrate import Migrate
from app.database import init_db
from app.models import db

def create_app():
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@cart-db/pisadaprodb_cart"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicialización de la base de datos
    init_db(app)
    migrate = Migrate(app, db)

    # Registro de rutas
    from app.routes import cart_bp
    app.register_blueprint(cart_bp, url_prefix='/api/cart')

    return app
