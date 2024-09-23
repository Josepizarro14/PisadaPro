from .database import db  # Importa la instancia db desde database.py
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Cliente(db.Model, UserMixin):
    __tablename__ = 'clientes'
    
    rut_persona = db.Column(db.String(12), nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    direccion = db.Column(db.String(100), nullable=False)
    comuna = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), primary_key=True, unique=True, nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    contrasena = db.Column(db.String(128), nullable=False) # Guardamos el hash de la contraseña

    # Constructor
    def __init__(self, rut_persona, nombre, apellido, direccion, comuna, region, email, telefono, contrasena):
        self.rut_persona = rut_persona
        self.nombre = nombre
        self.apellido = apellido
        self.direccion = direccion
        self.comuna = comuna
        self.region = region
        self.email = email
        self.telefono = telefono
        self.set_password(contrasena)

    # Métodos para manejar la contraseña de forma segura
    def set_password(self, contrasena):
        self.contrasena = generate_password_hash(contrasena)

    def check_password(self, contrasena):
        return check_password_hash(self.contrasena, contrasena)


    # Método necesario por Flask-Login para identificar al usuario
    def get_id(self):
        return self.email
