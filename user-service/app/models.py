from .database import db
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
    contrasena = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='cliente')  # 'cliente' o 'administrador'


    def __init__(self, rut_persona, nombre, apellido, direccion, comuna, region, email, telefono, contrasena, rol='cliente'):
        self.rut_persona = rut_persona
        self.nombre = nombre
        self.apellido = apellido
        self.direccion = direccion
        self.comuna = comuna
        self.region = region
        self.email = email
        self.telefono = telefono
        self.set_password(contrasena)
        self.rol = rol

    def set_password(self, contrasena):
        self.contrasena = generate_password_hash(contrasena)

    def check_password(self, contrasena):
        return check_password_hash(self.contrasena, contrasena)

    def get_id(self):
        return self.email
