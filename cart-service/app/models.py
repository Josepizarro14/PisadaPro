from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# Tabla de Clientes
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
    contrasena = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default='cliente') 

    compras = db.relationship('Compra', backref='cliente', lazy=True)

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

# Tabla de Compras
class Compra(db.Model):
    __tablename__ = 'compras'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_email = db.Column(db.String(100), db.ForeignKey('clientes.email'), nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    total = db.Column(db.Float, nullable=False)

    detalles = db.relationship('DetalleCompra', backref='compra', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_email": self.cliente_email,
            "fecha": self.fecha.isoformat(),
            "total": self.total,
            "detalles": [detalle.to_dict() for detalle in self.detalles]
        }

# Tabla de Detalles de Compra
class DetalleCompra(db.Model):
    __tablename__ = 'detalles_compra'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    compra_id = db.Column(db.Integer, db.ForeignKey('compras.id'), nullable=False)
    nombre_zapatilla = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    precio = db.Column(db.Float, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    imagen = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "compra_id": self.compra_id,
            "nombre_zapatilla": self.nombre_zapatilla,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "cantidad": self.cantidad,
            "imagen": self.imagen
        }
