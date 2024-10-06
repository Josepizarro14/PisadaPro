// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambia a la URL de tu backend
  withCredentials: true, // Esto asegura que se envíen las cookies
});

// Usar Axios en lugar de fetch para la función de login
export const login = async (email, password) => {
    const response = await api.post('/login', { email, password }); // Usar la instancia de Axios

    // Comprobar la respuesta
    if (response.status !== 200) {  // Verificar si el status no es 200
        throw new Error("Error en el inicio de sesión");
    }

    return response.data; // Devolver la data de la respuesta
};

export default api;
