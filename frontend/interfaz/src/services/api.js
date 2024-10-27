// src/services/api.js
import axios from 'axios';

// Instancia para el microservicio de usuarios
const userApi = axios.create({
  baseURL: 'http://localhost:5000/api', // URL del microservicio de usuarios
  withCredentials: true,
});

// Instancia para el microservicio de productos
const productApi = axios.create({
  baseURL: 'http://localhost:5001', // URL del microservicio de productos
  withCredentials: true,
});

// Usar Axios en lugar de fetch para la función de login
export const login = async (email, password) => {
    const response = await userApi.post('/login', { email, password }); // Usar la instancia de Axios

    // Comprobar la respuesta
    if (response.status !== 200) {  // Verificar si el status no es 200
        throw new Error("Error en el inicio de sesión");
    }

    return response.data; // Devolver la data de la respuesta
};

// Función para crear un nuevo producto (ejemplo)
export const createProduct = async (productData) => {
    const response = await productApi.post('/products', productData); // Cambia la ruta según tu API

    if (response.status !== 201) {
        throw new Error("Error al crear el producto");
    }

    return response.data;
};

// Exportar las instancias para ser utilizadas en otros archivos
export { userApi, productApi };
