// auth.js
import { userApi } from '../services/api';  // Importar la instancia de Axios como exportación nombrada

export const handleLogout = async (logout, navigate) => {
    try {
        const response = await userApi.post('/logout');
        if (response.status === 200) {
            console.log('Logout exitoso en el backend.');

            // Eliminar información del localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');

            // Llamar a la función logout para actualizar el contexto
            logout();

            navigate('/login');
        } else {
            console.error('Error al cerrar sesión:', response.status);
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};
