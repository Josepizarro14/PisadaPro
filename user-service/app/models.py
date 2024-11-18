from .database import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Cliente(db.Model, UserMixin):
    __tablename__ = 'clientes'
    
    rut_persona = db.Column(db.String(12), unique=True, nullable=False)  # Añadir unique=True
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    direccion = db.Column(db.String(100), nullable=False)
    comuna = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), primary_key=True, unique=True, nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='cliente')

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

    def to_dict(self):
        return {
            "rut_persona": self.rut_persona,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "direccion": self.direccion,
            "comuna": self.comuna,
            "region": self.region,
            "email": self.email,
            "telefono": self.telefono,
            "rol": self.rol
        }
    
class HistorialCompra(db.Model):
    __tablename__ = 'historial_compra'

    id = db.Column(db.Integer, primary_key=True)
    rut_persona = db.Column(db.String(12), db.ForeignKey('clientes.rut_persona'), nullable=False)
    nombre_zapatilla = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(255), nullable=False)
    fecha_compra = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación con Cliente
    cliente = db.relationship('Cliente', backref=db.backref('historial_compras', lazy=True))

    def __init__(self, rut_persona, nombre_zapatilla, descripcion, precio, categoria, stock, imagen):
        self.rut_persona = rut_persona
        self.nombre_zapatilla = nombre_zapatilla
        self.descripcion = descripcion
        self.precio = precio
        self.categoria = categoria
        self.stock = stock
        self.imagen = imagen

    def to_dict(self):
        return {
            "id": self.id,
            "rut_persona": self.rut_persona,
            "nombre_zapatilla": self.nombre_zapatilla,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "categoria": self.categoria,
            "stock": self.stock,
            "imagen": self.imagen,
            "fecha_compra": self.fecha_compra
        }

