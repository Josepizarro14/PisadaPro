from flask import Flask
from .database import db  # Importa db desde database.py
from .models import Cliente

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/pisadaprodb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Inicializa db con la app

with app.app_context():
    try:
        db.create_all()
        print("Tablas creadas exitosamente.")
    except Exception as e:
        print(f"Error al crear tablas: {e}")
