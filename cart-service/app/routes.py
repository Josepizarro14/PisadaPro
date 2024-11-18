from datetime import datetime
from flask import Blueprint, request, jsonify
from app.models import db, Compra, DetalleCompra, Cliente  # Asegúrate de importar el modelo Cliente

cart_bp = Blueprint('cart', __name__)

# Ruta para obtener los productos en el carrito
@cart_bp.route('/items', methods=['GET'])
def get_cart_items():
    cliente_email = request.args.get('email')
    if not cliente_email:
        return jsonify({"error": "Email del cliente es requerido"}), 400

    carrito = DetalleCompra.query.join(Compra).filter(Compra.cliente_email == cliente_email, Compra.estado == 'pendiente').all()
    if not carrito:
        return jsonify({"message": "No hay productos en el carrito"}), 200

    return jsonify([item.to_dict() for item in carrito]), 200

# Ruta para añadir un producto al carrito
@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    data = request.json
    try:
        # Verificar si el cliente existe en la tabla Clientes
        cliente = Cliente.query.filter_by(email=data['cliente_email']).first()
        if not cliente:
            # Si el cliente no existe, lo creamos
            cliente = Cliente(email=data['email'], nombre=data['nombre'], apellido=data['apellido'], direccion=data['direccion'], telefono=data['telefono'], rut_persona=data['rut'], comuna=data['comuna'], region=data['region'])  # Añadir
            db.session.add(cliente)
            db.session.commit()

        # Buscar o crear una compra activa para el cliente
        compra = Compra.query.filter_by(cliente_email=data['cliente_email'], estado='pendiente').first()
        if not compra:
            compra = Compra(cliente_email=data['cliente_email'], fecha=datetime.datetime.utcnow(), total=0, estado='pendiente')
            db.session.add(compra)
            db.session.flush()  # Generar el ID de la compra

        # Añadir el producto al carrito
        nuevo_item = DetalleCompra(
            compra_id=compra.id,
            nombre_zapatilla=data['nombre_zapatilla'],
            descripcion=data['descripcion'],
            precio=data['precio'],
            cantidad=data['cantidad'],
            imagen=data['imagen']
        )
        db.session.add(nuevo_item)
        db.session.commit()

        return jsonify({"message": "Producto añadido al carrito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@cart_bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    cliente_email = data.get('cliente_email')
    productos = data.get('productos', [])
    print("Datos recibidos:", data)

    if not productos:
        return jsonify({"error": "Debe haber productos en el carrito"}), 400

    try:
        cliente = Cliente.query.filter_by(email=cliente_email).first()
        if not cliente:
            cliente = Cliente(
                rut_persona=data.get('rut_cliente', 'sin-rut'),
                email=cliente_email,
                nombre=data.get('nombre_cliente', 'Cliente'),
                apellido=data.get('apellido_cliente', 'Invitado'),
                direccion=data.get('direccion_cliente', 'Sin dirección'),
                comuna=data.get('comuna_cliente', 'Sin comuna'),
                region=data.get('region_cliente', 'Sin región'),
                telefono=data.get('telefono_cliente', 'Sin teléfono'),
                rol='invitado'
            )
            db.session.add(cliente)
            db.session.flush()

        # Crear compra con datos del cliente
        compra = Compra(
            cliente_email=cliente_email,
            fecha=datetime.utcnow(),
            total=0,
            estado='pendiente',
            nombre_cliente=cliente.nombre,
            direccion_cliente=cliente.direccion,
            comuna_cliente=cliente.comuna,
            region_cliente=cliente.region,
            telefono_cliente=cliente.telefono
        )
        db.session.add(compra)
        db.session.flush()

        total = 0
        for producto in productos:
            nuevo_item = DetalleCompra(
                compra_id=compra.id,
                nombre_zapatilla=producto['nombre_zapatilla'],
                descripcion=producto['descripcion'],
                precio=producto['precio'],
                cantidad=producto['cantidad'],
                imagen=producto['imagen']
            )
            db.session.add(nuevo_item)
            total += producto['precio'] * producto['cantidad']

        compra.total = total
        compra.estado = 'finalizada'
        db.session.commit()

        return jsonify({"message": "Compra realizada con éxito", "compra": compra.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error en el endpoint /checkout: {e}")
        return jsonify({"error": str(e)}), 500








# Ruta para eliminar un producto del carrito
@cart_bp.route('/items/<int:id>', methods=['DELETE'])
def delete_cart_item(id):
    item = DetalleCompra.query.get(id)
    if not item:
        return jsonify({"error": "Producto no encontrado"}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Producto eliminado del carrito"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Ruta para vaciar el carrito
@cart_bp.route('/items', methods=['DELETE'])
def clear_cart():
    cliente_email = request.args.get('email')
    if not cliente_email:
        return jsonify({"error": "Email del cliente es requerido"}), 400

    try:
        items = DetalleCompra.query.join(Compra).filter(Compra.cliente_email == cliente_email, Compra.estado == 'pendiente').all()
        for item in items:
            db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Carrito vaciado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Ruta para obtener los detalles de una compra finalizada
@cart_bp.route('/purchase_details', methods=['GET'])
def get_purchase_details():
    cliente_email = request.args.get('email')
    if not cliente_email:
        return jsonify({"error": "Email del cliente es requerido"}), 400

    # Buscar la compra finalizada del cliente
    compra = Compra.query.filter_by(cliente_email=cliente_email, estado='finalizada').first()
    if not compra:
        return jsonify({"error": "No se ha encontrado una compra finalizada para este cliente"}), 404

    # Obtener los detalles de la compra
    detalles_compra = DetalleCompra.query.filter_by(compra_id=compra.id).all()
    if not detalles_compra:
        return jsonify({"error": "No hay productos en esta compra"}), 404

    # Retornar los detalles de la compra
    return jsonify({
        "compra": compra.to_dict(),
        "detalles": [item.to_dict() for item in detalles_compra]
    }), 200
