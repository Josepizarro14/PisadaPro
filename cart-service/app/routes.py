from datetime import datetime
from flask import Blueprint, request, jsonify
from app.models import db, Compra, DetalleCompra, Cliente  # Asegúrate de importar el modelo Cliente
from transbank.webpay.webpay_plus.transaction import Transaction
import pymongo
cart_bp = Blueprint('cart', __name__)

MONGO_URL = "mongodb://product-db:27017/pisadapro_products"
mongo_client = pymongo.MongoClient(MONGO_URL)
mongo_db = mongo_client.get_database()
products_collection = mongo_db.get_collection("products")


CATALOG_MONGO_URL = "mongodb://catalog-db:27017/pisadapro_catalogs"
catalog_client = pymongo.MongoClient(CATALOG_MONGO_URL)
catalog_db = catalog_client.get_database()
catalog_collection = catalog_db.get_collection("products")

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
    print("Inicio del proceso de checkout. Datos recibidos:", data)
    
    # Verificar datos básicos
    if not data.get('productos', []):
        return jsonify({"error": "Debe haber productos en el carrito"}), 400
    
    try:
        # Verificar que los datos se reciben correctamente solo una vez
        print("Recibido el pedido:", data)
        
        # Buscar o crear cliente
        cliente = Cliente.query.filter_by(email=data.get('cliente_email')).first()
        if not cliente:
            print("Cliente no encontrado, creando uno nuevo...")
            cliente = Cliente(
                rut_persona=data.get('rut_cliente', 'sin-rut'),
                email=data.get('cliente_email'),
                nombre=data.get('nombre_cliente', 'Cliente'),
                direccion=data.get('direccion_cliente', 'Sin dirección'),
                comuna=data.get('comuna_cliente', 'Sin comuna'),
                region=data.get('region_cliente', 'Sin región'),
                telefono=data.get('telefono_cliente', 'Sin teléfono'),
            )
            db.session.add(cliente)
            db.session.flush()
            print("Cliente creado:", cliente.to_dict())

        # Crear la compra pero con estado pendiente
        compra = Compra(
            cliente_email=data['cliente_email'],
            fecha=datetime.utcnow(),
            total=0,
            estado='pendiente',
            nombre_cliente=cliente.nombre,
            direccion_cliente=cliente.direccion,
            comuna_cliente=cliente.comuna,
            region_cliente=cliente.region,
            telefono_cliente=cliente.telefono,
        )
        db.session.add(compra)
        db.session.flush()
        print("Compra creada con ID:", compra.id)

        total = 0
        for producto in data['productos']:
            # Validar que la talla esté presente en el producto
            if not producto.get('talla'):
                return jsonify({"error": f"Falta la talla para el producto {producto.get('nombre_zapatilla', 'sin nombre')}"}), 400
            
            detalle = DetalleCompra(
                compra_id=compra.id,
                nombre_zapatilla=producto['nombre_zapatilla'],
                descripcion=producto['descripcion'],
                precio=producto['precio'],
                cantidad=producto['cantidad'],
                imagen=producto['imagen'],
                talla=producto['talla']  # Nueva asignación de talla
            )
            db.session.add(detalle)
            total += producto['precio'] * producto['cantidad']
            print("Detalle agregado:", detalle.to_dict())

        # Actualizar el total de la compra
        compra.total = total
        db.session.commit()
        print("Compra guardada en la base de datos.")
        return jsonify({"message": "Compra registrada con éxito. Esperando pago", "compra": compra.to_dict()}), 201
    
    except Exception as e:
        db.session.rollback()
        print("Error durante el checkout:", e)
        return jsonify({"error": "Error en el servidor. Intente nuevamente."}), 500












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

@cart_bp.route('/pay', methods=['POST'])
def initiate_payment():
    data = request.json
    cliente_email = data.get('cliente_email')

    # Verificar si existe una compra pendiente
    compra = Compra.query.filter_by(cliente_email=cliente_email, estado='pendiente').first()
    if not compra:
        return jsonify({"error": "No hay compras pendientes para este cliente"}), 404

    # Crear transacción con Transbank
    try:
        transaction = Transaction()
        response = transaction.create(
            buy_order=str(compra.id),
            session_id=cliente_email,
            amount=compra.total,
            return_url='http://localhost:5003/cart/payment-return'  # URL de retorno
        )
        print("Transacción iniciada con éxito, respuesta:", response)  # Log para ver la respuesta
        return jsonify({"url": response['url'], "token": response['token']})
    except Exception as e:
        print(f"Error al crear la transacción: {str(e)}")  # Log del error
        return jsonify({"error": f"Error al iniciar el pago: {str(e)}"}), 500


@cart_bp.route('/confirm', methods=['POST'])
def confirm_payment():
    token = request.form.get('token_ws')
    if not token:
        return jsonify({"error": "Token no recibido"}), 400

    try:
        transaction = Transaction()
        response = transaction.commit(token)

        if response['status'] == 'AUTHORIZED':
            # Actualizar estado de la compra
            compra = Compra.query.get(int(response['buy_order']))
            compra.estado = 'pagada'
            db.session.commit()
            return jsonify({"message": "Pago confirmado", "compra": compra.to_dict()}), 200
        else:
            return jsonify({"error": "Transacción no autorizada", "details": response}), 400
    except Exception as e:
        return jsonify({"error": f"Error al confirmar el pago: {str(e)}"}), 500

from flask import redirect

@cart_bp.route('/payment-return', methods=['POST', 'GET'])
def payment_return():
    token = request.args.get('token_ws')  # O `request.json` si usas POST
    if not token:
        return jsonify({"error": "Token no recibido"}), 400

    try:
        # Validar la transacción con Transbank
        transaction = Transaction()
        response = transaction.commit(token)

        if response.get('status') == 'AUTHORIZED':
            compra_id = int(response.get('buy_order', 0))
            compra = Compra.query.get(compra_id)

            if not compra:
                return jsonify({"error": "Compra no encontrada"}), 404

            # Validar el monto
            if float(compra.total) != float(response.get('amount', 0)):
                return jsonify({"error": "El monto de la transacción no coincide con la compra"}), 400

            # Descontar el stock
            for detalle in compra.detalles:
                product = products_collection.find_one({"nombre": detalle.nombre_zapatilla})
                if not product:
                    return jsonify({"error": f"Producto '{detalle.nombre_zapatilla}' no encontrado"}), 404

                talla = detalle.talla
                cantidad = detalle.cantidad

                # Verificar si existe suficiente stock para la talla
                stock_actual = product.get("stockPorTalla", {}).get(talla, 0)
                if stock_actual < cantidad:
                    return jsonify({"error": f"Stock insuficiente para la talla {talla} del producto '{detalle.nombre_zapatilla}'"}), 400

                # Descontar el stock
                products_collection.update_one(
                    {"_id": product["_id"]},
                    {"$inc": {f"stockPorTalla.{talla}": -cantidad}}
                )

                catalog_product = catalog_collection.find_one({"nombre": detalle.nombre_zapatilla})
                if not catalog_product:
                    return jsonify({"error": f"Producto '{detalle.nombre_zapatilla}' no encontrado en el catálogo"}), 404

                catalog_collection.update_one(
                    {"_id": catalog_product["_id"]},
                    {"$inc": {f"stockPorTalla.{talla}": -cantidad}}
                )

            # Cambiar el estado de la compra
            compra.estado = 'pagada'
            db.session.commit()

            # Redirigir al frontend con éxito
            return redirect(f'http://localhost:3000/order-success?order_id={compra.id}')

        else:
            # Si no autorizado, redirigir con error
            return redirect(f'http://localhost:3000/order-failure?error=pago_no_autorizado')

    except Exception as e:
        # Redirigir al frontend con error general
        return redirect(f'http://localhost:3000/order-failure?error={str(e)}')
    
    
@cart_bp.route('/get-order-details/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    try:
        # Buscar la compra en la base de datos por su ID
        compra = Compra.query.get(order_id)

        if not compra:
            return jsonify({"error": "Compra no encontrada"}), 404

        # Obtener los detalles de los productos (detalles de la compra)
        detalles = [{
            "nombre_zapatilla": detalle.nombre_zapatilla,
            "descripcion": detalle.descripcion,
            "precio": detalle.precio,
            "cantidad": detalle.cantidad,
            "imagen": detalle.imagen,
            "talla": detalle.talla  # Incluir la talla en los detalles
        } for detalle in compra.detalles]

        # Retornar los detalles de la compra incluyendo los productos
        return jsonify({
            "id": compra.id,
            "cliente_email": compra.cliente_email,
            "estado": compra.estado,
            "total": compra.total,
            "fecha": compra.fecha.strftime('%Y-%m-%d %H:%M:%S'),  # Formato de la fecha
            "productos": detalles  # Incluir los productos con sus detalles
        }), 200

    except Exception as e:
        # Manejar cualquier error inesperado
        return jsonify({"error": f"Hubo un problema al obtener los detalles de la compra: {str(e)}"}), 500

