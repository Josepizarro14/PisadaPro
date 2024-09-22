from .database import db  # Importa la instancia db desde database.py

class Cliente(db.Model):
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

    def __init__(self, rut_persona, nombre, apellido, direccion, comuna, region, email, telefono, contrasena):
        self.rut_persona = rut_persona
        self.nombre = nombre
        self.apellido = apellido
        self.direccion = direccion
        self.comuna = comuna
        self.region = region
        self.email = email
        self.telefono = telefono
        self.contrasena = contrasena
