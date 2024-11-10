// server.js
const app = require('./App'); // Importa la configuración de tu aplicación desde App.js
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
