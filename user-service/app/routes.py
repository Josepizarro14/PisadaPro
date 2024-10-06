from flask import Flask, request, jsonify, abort, flash
from .models import Cliente  # Asegúrate de importar tu modelo Cliente
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

def load_routes(app, db):  
    # Ruta para la página de inicio (opcional, podría no ser necesaria para una API)
    @app.route('/', methods=['GET'])
    def home():
        return jsonify(message='¡Bienvenido a la API!')

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos.'}), 400

        rut_persona = data.get('rut_persona')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        direccion = data.get('direccion')
        comuna = data.get('comuna')
        region = data.get('region')
        email = data.get('email')
        telefono = data.get('telefono')
        contrasena = data.get('contrasena')

        # Verificar si el correo ya está registrado
        cliente_existente = Cliente.query.filter_by(email=email).first()
        if cliente_existente:
            return jsonify({'message': 'Este correo ya está registrado. Por favor, inicie sesión.'}), 409

        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            rut_persona=rut_persona,
            nombre=nombre,
            apellido=apellido,
            direccion=direccion,
            comuna=comuna,
            region=region,
            email=email,
            telefono=telefono,
            contrasena=contrasena  # Contraseña será hasheada en el método __init__
        )
        
        # El método set_password será llamado automáticamente en el __init__
        # donde se aplica el hashing a la contraseña.

        # Guardar en la base de datos
        try:
            db.session.add(nuevo_cliente)
            db.session.commit()
            
            # Iniciar sesión automáticamente
            login_user(nuevo_cliente)

            return jsonify({'message': 'Registro exitoso. Ahora puedes iniciar sesión.'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Ocurrió un error al registrarte: {e}'}), 500


    # Ruta para cerrar sesión
    @app.route('/api/logout', methods=['POST'])
    @login_required
    def logout():
        logout_user()  # Cierra la sesión del usuario
        return jsonify({'message': 'Has cerrado sesión exitosamente.'}), 200

    @app.route('/api/admin', methods=['GET'])
    @login_required
    def admin():
        if not current_user.is_authenticated:
            abort(403)  # Acceso prohibido si no está autenticado

        if current_user.rol != 'administrador':
            abort(403)  # Acceso prohibido si no es administrador
        
        clientes = Cliente.query.all()  # Obtener todos los clientes
        return jsonify([cliente.to_dict() for cliente in clientes])


    # Ruta para crear un nuevo cliente
    @app.route('/api/create_client', methods=['POST'])
    @login_required  # Asegúrate de que el usuario esté autenticado
    def create_client():
        data = request.get_json()

        rut_persona = data.get('rut_persona')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        direccion = data.get('direccion')
        comuna = data.get('comuna')
        region = data.get('region')
        email = data.get('email')
        telefono = data.get('telefono')
        rol = data.get('rol')
        contrasena = data.get('contrasena')

        # Verificar si el correo ya está registrado
        cliente_existente = Cliente.query.filter_by(email=email).first()
        if cliente_existente:
            return jsonify({'message': 'Este correo ya está registrado.'}), 400

        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            rut_persona=rut_persona,
            nombre=nombre,
            apellido=apellido,
            direccion=direccion,
            comuna=comuna,
            region=region,
            email=email,
            telefono=telefono,
            contrasena=generate_password_hash(contrasena),
            rol=rol
        )

        try:
            db.session.add(nuevo_cliente)
            db.session.commit()
            return jsonify({'message': 'Cliente creado exitosamente.'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error al crear cliente: {e}'}), 500

    @app.route('/api/login', methods=['POST'])
    @login_required
    def login():
        data = request.get_json()

        if not data:
            return jsonify({'message': 'No se recibieron datos.'}), 400

        email = data.get('email')
        password = data.get('password')

        try:
            # Intenta obtener el usuario de la base de datos
            cliente = Cliente.query.filter_by(email=email).first()

            if cliente and cliente.check_password(password):
                login_user(cliente)  # Inicia sesión
                # Devuelve el nombre y el rol del usuario
                return jsonify({
                    'message': 'Inicio de sesión exitoso.', 
                    'nombre': cliente.nombre,  # Asegúrate de que 'nombre' es un campo válido en tu modelo
                    'role': cliente.rol
                }), 200

            return jsonify({'message': 'Credenciales inválidas.'}), 401

        except Exception as e:
            return jsonify({'message': f'Ocurrió un error al intentar iniciar sesión: {e}'}), 500




    @app.route('/api/edit_client/<email>', methods=['PUT'])
    @login_required
    def edit_client(email):
        cliente = Cliente.query.filter_by(email=email).first()
        if not cliente:
            return jsonify({'message': 'Cliente no encontrado.'}), 404

        data = request.get_json()

        cliente.rut_persona = data.get('rut_persona', cliente.rut_persona)
        cliente.nombre = data.get('nombre', cliente.nombre)
        cliente.apellido = data.get('apellido', cliente.apellido)
        cliente.direccion = data.get('direccion', cliente.direccion)
        cliente.comuna = data.get('comuna', cliente.comuna)
        cliente.region = data.get('region', cliente.region)
        cliente.telefono = data.get('telefono', cliente.telefono)
        cliente.rol = data.get('rol', cliente.rol)

        # Manejar el campo de contraseña
        nueva_contrasena = data.get('contrasena')
        if nueva_contrasena:  # Solo actualizar la contraseña si se ingresa una nueva
            cliente.contrasena = generate_password_hash(nueva_contrasena)

        try:
            db.session.commit()
            return jsonify({'message': 'Cliente actualizado correctamente.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Ocurrió un error: {e}'}), 500

    # Ruta para eliminar un cliente
    @app.route('/api/delete_client/<email>', methods=['DELETE'])
    @login_required
    def delete_client(email):
        cliente = Cliente.query.filter_by(email=email).first()
        
        if cliente:
            try:
                db.session.delete(cliente)
                db.session.commit()
                return jsonify({'message': 'Cliente eliminado exitosamente.'}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({'message': f'Error al eliminar cliente: {e}'}), 500
        else:
            return jsonify({'message': 'Cliente no encontrado.'}), 404


    @app.route('/api/edit_profile', methods=['PUT'])
    @login_required
    def edit_profile():
        data = request.get_json()
        current_user.nombre = data.get('nombre', current_user.nombre)
        current_user.apellido = data.get('apellido', current_user.apellido)
        current_user.direccion = data.get('direccion', current_user.direccion)
        current_user.comuna = data.get('comuna', current_user.comuna)
        current_user.region = data.get('region', current_user.region)
        current_user.email = data.get('email', current_user.email)
        current_user.telefono = data.get('telefono', current_user.telefono)

        # Verifica si se proporciona una nueva contraseña
        nueva_contrasena = data.get('contrasena')
        if nueva_contrasena is not None and nueva_contrasena != '':
            current_user.contrasena = generate_password_hash(nueva_contrasena)

        try:
            db.session.commit()
            return jsonify({'message': 'Perfil actualizado con éxito.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error al actualizar el perfil: {e}'}), 500

    
    
    @app.route('/api/clientes', methods=['GET'])
    @login_required
    def get_clientes():
        """
        Función para obtener todos los clientes.
        Solo accesible para usuarios autenticados con rol de administrador.
        """
        if current_user.rol != 'administrador':
            abort(403)  # Acceso prohibido si no es administrador
        
        # Obtener todos los clientes
        clientes = Cliente.query.all()
        
        # Convertir los clientes a formato JSON
        return jsonify([cliente.to_dict() for cliente in clientes])  # Asegúrate de que tu modelo tenga un método to_dict()

    @app.route('/api/admin/clientes', methods=['GET'])
    def obtener_clientes():
        if current_user.rol != 'administrador':
            return jsonify({'message': 'Acceso prohibido.'}), 403
        
        try:
            clientes = Cliente.query.all()  # Obtener todos los clientes
            return jsonify([cliente.to_dict() for cliente in clientes])  # Convertir cada cliente a diccionario
        except Exception as e:
            return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500