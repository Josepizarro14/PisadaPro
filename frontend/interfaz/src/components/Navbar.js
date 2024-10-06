import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

const Navbar = () => {
    const { user, logout } = useUser(); // Acceder también a la función logout
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Verificar si el usuario está autenticado
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        console.log(`Usuario autenticado: ${isAuthenticated ? 'Sí' : 'No'}`);
    
        if (isAuthenticated) {
            try {
                const response = await api.post('/logout');
    
                if (response.status === 200) {
                    console.log('Logout exitoso en el backend.');
    
                    // Eliminar información del localStorage
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userEmail');
    
                    // Llamar a la función logout para actualizar el contexto
                    logout(); // Esto actualizará el estado de autenticación en el contexto
    
                    // Redirigir al login
                    navigate('/login');
                } else {
                    console.error('Error al cerrar sesión:', response.status);
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        } else {
            console.log('No se puede cerrar sesión: el usuario no está autenticado.');
        }
    };
    

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">PisadaPro</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contacto</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Bienvenido, {user?.userName || localStorage.getItem('userName')}
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/update-account">Actualizar cuenta</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/order-history">Historial de pedidos</Link>
                                    </li>
                                    {userRole === 'administrador' && (
                                        <li>
                                            <Link className="dropdown-item" to="/admin-panel">Panel de control</Link>
                                        </li>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Mi Cuenta
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/register">Registrarse</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/login">Iniciar Sesión</Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
