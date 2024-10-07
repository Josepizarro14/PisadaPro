from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello from the cart service!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
