from flask import Flask
from .database import db, init_db
from .models import Cliente
from flask_login import LoginManager

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/pisadaprodb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'appweb'  # Cambia esto a una clave más segura

    # Inicializar base de datos
    init_db(app)

    # Configurar Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Redirigir a la página de inicio de sesión si no está autenticado
    login_manager.login_view = 'login'  # Ruta para la página de login
    login_manager.login_message = "Por favor, inicia sesión para acceder a esta página."

    # Función para cargar el usuario desde la base de datos
    @login_manager.user_loader
    def load_user(user_id):
        return Cliente.query.get(user_id)  # No se necesita convertir a int

    with app.app_context():
        try:
            db.create_all()
            print("Tablas creadas exitosamente.")
        except Exception as e:
            print(f"Error al crear tablas: {e}")

    from .routes import load_routes
    load_routes(app, db)

    return app
