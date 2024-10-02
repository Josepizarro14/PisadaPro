from flask import render_template, request, redirect, url_for, flash, abort, Blueprint, jsonify
from .models import Cliente  
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
import time, requests

admin_bp = Blueprint('admin', __name__)

# URL base de tu microservicio de productos
PRODUCT_SERVICE_URL = "http://localhost:3000"
api = Blueprint('api', __name__)
 # Ruta para la página de inicio

def load_routes(app, db):  
    @app.route('/')
    def home():
        #return '¡Hola, mundo!'
        return render_template('home.html')  # Asegúrate de tener un template para el home

    # Ruta para la página "Sobre nosotros"
    @app.route('/about')
    def about():
        return render_template('about.html')
        
        # Ruta para el registro de usuarios
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'POST':
            rut_persona = request.form['rut_persona']
            nombre = request.form['nombre']
            apellido = request.form['apellido']
            direccion = request.form['direccion']
            comuna = request.form['comuna']
            region = request.form['region']
            email = request.form['email']
            telefono = request.form['telefono']
            contrasena = request.form['contrasena']

            # Verificar si el correo ya está registrado
            cliente_existente = Cliente.query.filter_by(email=email).first()
            if cliente_existente:
                flash('Este correo ya está registrado. Por favor, inicie sesión.', 'warning')
                return render_template('register.html')

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
                contrasena=contrasena
            )

            # Guardar en la base de datos
            try:
                db.session.add(nuevo_cliente)
                db.session.commit()
                flash('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
                return render_template('register.html')
            except Exception as e:
                flash(f'Ocurrió un error al registrarte: {e}', 'danger')
                db.session.rollback()

        return render_template('register.html')




    # Ruta para cerrar sesión (lógica por implementar)
    @app.route('/logout')
    @login_required  # Asegúrate de que el usuario esté autenticado
    def logout():
        logout_user()  # Cierra la sesión del usuario
        flash('Has cerrado sesión exitosamente.', 'info')
        return redirect(url_for('home'))


    # Ruta para el panel de administración
    @app.route('/admin', methods=['GET', 'POST'])
    @login_required
    def admin():
        if current_user.rol != 'administrador':
            abort(403)  # Acceso prohibido si no es administrador
        clientes = Cliente.query.all()  # Obtener todos los clientes
        return render_template('admin.html', clientes=clientes)
        
    # Ruta para crear un nuevo cliente
    @app.route('/create_client', methods=['GET', 'POST'])
    def create_client():
        if request.method == 'POST':
            rut_persona = request.form['rut_persona']
            nombre = request.form['nombre']
            apellido = request.form['apellido']
            direccion = request.form['direccion']
            comuna = request.form['comuna']
            region = request.form['region']
            email = request.form['email']
            telefono = request.form['telefono']
            rol = request.form['rol']
            contrasena = request.form['contrasena']

            # Verificar si el correo ya está registrado
            cliente_existente = Cliente.query.filter_by(email=email).first()
            if cliente_existente:
                flash('Este correo ya está registrado.', 'warning')
                return redirect(url_for('create_client'))

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
                contrasena=contrasena,
                rol=rol
            )

            try:
                db.session.add(nuevo_cliente)
                db.session.commit()
                flash('Cliente creado exitosamente.', 'success')
                return redirect(url_for('admin'))  # Redirigir al panel de administración
            except Exception as e:
                flash(f'Error al crear cliente: {e}', 'danger')
                db.session.rollback()

        return render_template('create_client.html')

    @app.route('/edit_client/<email>', methods=['GET', 'POST'])
    def edit_client(email):
        cliente = Cliente.query.filter_by(email=email).first()
        if request.method == 'POST':
            # Actualizar otros campos del cliente
            cliente.rut_persona = request.form['rut_persona']
            cliente.nombre = request.form['nombre']
            cliente.apellido = request.form['apellido']
            cliente.direccion = request.form['direccion']
            cliente.comuna = request.form['comuna']
            cliente.region = request.form['region']
            cliente.email = request.form['email']
            cliente.telefono = request.form['telefono']
            cliente.rol = request.form['rol']  # Actualizar el rol si se cambia

            # Manejar el campo de contraseña
            nueva_contrasena = request.form['contrasena']
            if nueva_contrasena:  # Solo actualizar la contraseña si se ingresa una nueva
                cliente.contrasena = generate_password_hash(nueva_contrasena)

            try:
                db.session.commit()
                flash('Cliente actualizado correctamente.', 'success')
            except Exception as e:
                db.session.rollback()
                flash(f'Ocurrió un error: {e}', 'danger')

            return redirect(url_for('admin'))

        return render_template('edit_client.html', cliente=cliente)


    # Ruta para eliminar un cliente
    @app.route('/delete_client/<email>', methods=['POST'])
    def delete_client(email):
        cliente = Cliente.query.filter_by(email=email).first()
        
        if cliente:
            try:
                db.session.delete(cliente)
                db.session.commit()
                flash('Cliente eliminado exitosamente.', 'success')
            except Exception as e:
                flash(f'Error al eliminar cliente: {e}', 'danger')
                db.session.rollback()
        else:
            flash('Cliente no encontrado.', 'danger')
        
        return redirect(url_for('admin'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form['email']
            password = request.form['password']
            
            cliente = Cliente.query.filter_by(email=email).first()
            if cliente and cliente.check_password(password):  # Cambia aquí
                login_user(cliente)  # Inicia sesión
                flash('Inicio de sesión exitoso.', 'success')
                return redirect(url_for('home'))
            else:
                flash('Correo o contraseña incorrectos.', 'danger')
        
        return render_template('login.html')

    @app.route('/edit_profile', methods=['GET', 'POST'])
    @login_required
    def edit_profile():
        with app.app_context():  # Asegura que hay un contexto de aplicación
            if request.method == 'POST':
                # Obtener los datos del formulario
                current_user.nombre = request.form.get('nombre')
                current_user.apellido = request.form.get('apellido')
                current_user.direccion = request.form.get('direccion')
                current_user.comuna = request.form.get('comuna')
                current_user.region = request.form.get('region')
                current_user.email = request.form.get('email')
                current_user.telefono = request.form.get('telefono')

                nueva_contrasena = request.form.get('contrasena')
                if nueva_contrasena:
                    # Si se ingresa una nueva contraseña, se hashea y actualiza
                    current_user.contrasena = generate_password_hash(nueva_contrasena)

                try:
                    # Guardar los cambios en la base de datos
                    db.session.commit()
                    flash('Perfil actualizado con éxito', 'success')
                    return redirect(url_for('home'))
                except Exception as e:
                    flash(f'Error al actualizar el perfil: {e}', 'danger')
                    return redirect(url_for('edit_profile'))

            return render_template('edit_profile.html', cliente=current_user)
    
    # Ruta para el control de inventario

    @app.route('/create_product', methods=['GET', 'POST'])
    @login_required
    def create_product():
        if current_user.rol != 'administrador':
            abort(403)  # Acceso prohibido si no es administrador

        if request.method == 'POST':
            nombre = request.form['nombre']
            descripcion = request.form['descripcion']
            precio = request.form['precio']
            categoria = request.form['categoria']
            stock = request.form['stock']
            imagen = request.form['imagen']

            try:
                # Hacer una solicitud POST a tu microservicio de productos
                response = requests.post('http://localhost:3000/products/create', json={
                    'nombre': nombre,
                    'descripcion': descripcion,
                    'precio': precio,
                    'categoria': categoria,
                    'stock': stock,
                    'imagen': imagen
                })

                if response.status_code == 201:
                    flash('Producto creado exitosamente.', 'success')
                    return redirect(url_for('inventory_control'))
                else:
                    flash('Error al crear el producto: {}'.format(response.json().get('error', 'Error desconocido')), 'danger')

            except Exception as e:
                flash(f'Error al crear producto: {e}', 'danger')

        return render_template('create_product.html')  # Asegúrate de tener esta plantilla


    
    
    @app.route('/inventory_control', methods=['GET', 'POST'])
    @login_required
    def inventory_control():
        if request.method == 'POST':
            # Lógica para agregar un producto
            product_data = {
                'name': request.form['name'],
                'description': request.form['description'],
                'price': request.form['price'],
                'category': request.form['category'],
                'stock': request.form['stock'],
                'image': request.form['image']
            }
            response = requests.post(f"{PRODUCT_SERVICE_URL}/products", json=product_data)

            if response.status_code == 201:
                flash("Producto agregado con éxito!", "success")
                return redirect(url_for('admin.inventory_control'))
            else:
                flash("Error al agregar el producto", "error")
        
        # Obtener los productos existentes
        response = requests.get(f"{PRODUCT_SERVICE_URL}/products")
        products = response.json() if response.status_code == 200 else []

        return render_template('inventory_control.html', products=products)

        