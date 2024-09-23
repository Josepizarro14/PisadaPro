from flask import render_template, request, redirect, url_for, flash
from .models import Cliente  # Asegúrate de importar tu modelo Cliente
import time

from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash


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
    def logout():
        # Aquí puedes manejar la lógica de cerrar sesión, por ejemplo, eliminando la sesión del usuario
        flash('Has cerrado sesión exitosamente.', 'info')
        return redirect(url_for('home'))

    # Ruta para el panel de administración
    @app.route('/admin', methods=['GET', 'POST'])
    def admin():
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
                contrasena=contrasena
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

    # Ruta para editar un cliente
    @app.route('/edit_client/<email>', methods=['GET', 'POST'])
    def edit_client(email):
        cliente = Cliente.query.filter_by(email=email).first()
        
        if not cliente:
            flash('Cliente no encontrado.', 'danger')
            return redirect(url_for('admin'))
        
        if request.method == 'POST':
            cliente.rut_persona = request.form['rut_persona']
            cliente.nombre = request.form['nombre']
            cliente.apellido = request.form['apellido']
            cliente.direccion = request.form['direccion']
            cliente.comuna = request.form['comuna']
            cliente.region = request.form['region']
            cliente.email = request.form['email']
            cliente.telefono = request.form['telefono']
            cliente.contrasena = request.form['contrasena']

            try:
                db.session.commit()
                flash('Cliente actualizado exitosamente.', 'success')
                return redirect(url_for('admin'))
            except Exception as e:
                flash(f'Error al actualizar cliente: {e}', 'danger')
                db.session.rollback()

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
            
            # Aquí se realiza la lógica de autenticación
            cliente = Cliente.query.filter_by(email=email).first()
            if cliente and cliente.contrasena == password:
                flash('Inicio de sesión exitoso.', 'success')
                time.sleep(2)
                return redirect(url_for('home'))
            else:
                flash('Correo o contraseña incorrectos.', 'danger')
        
        return render_template('login.html')







