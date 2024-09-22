from flask import Flask
from .database import db, init_db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/pisadaprodb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'appweb'  # Cambia esto a una clave más segura

    init_db(app)

    with app.app_context():
        try:
            db.create_all()
            print("Tablas creadas exitosamente.")
        except Exception as e:
            print(f"Error al crear tablas: {e}")

    from .routes import load_routes
    load_routes(app, db)

    return app
