from app import create_app  # Asegúrate de importar create_app
from .routes import general_blueprint

app = create_app()

app.register_blueprint(general_blueprint)



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
