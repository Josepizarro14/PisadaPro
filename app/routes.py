from flask import render_template, request, redirect, url_for, flash
from app import app, db
from app.models import Cliente  # Asegúrate de importar tu modelo Cliente

    # Ruta para la página de inicio
def load_routes(app):  
    @app.route('/')
    def home():
        #return '¡Hola, mundo!'
        return render_template('home.html')  # Asegúrate de tener un template para el home

    # Ruta para la página "Sobre nosotros"
    @app.route('/about')
    def about():
        return render_template('about.html')

    # Ruta para iniciar sesión
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            email = request.form['email']
            password = request.form['password']
            
            # Aquí se realiza la lógica de autenticación
            cliente = Cliente.query.filter_by(email=email).first()
            if cliente and cliente.contrasena == password:
                flash('Inicio de sesión exitoso.', 'success')
                return redirect(url_for('home'))
            else:
                flash('Correo o contraseña incorrectos.', 'danger')
        
        return render_template('login.html')

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
                return redirect(url_for('login'))

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
                return redirect(url_for('login'))
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

