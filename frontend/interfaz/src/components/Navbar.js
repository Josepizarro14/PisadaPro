import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; 

const Navbar = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userName = localStorage.getItem('userName'); // Guardaste el nombre en localStorage al iniciar sesión
    const userRole = localStorage.getItem('userRole'); // Guardaste el rol en localStorage al iniciar sesión
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Llama al endpoint de logout en el backend
            await api.post('/logout', {}, { withCredentials: true });
            
            // Elimina los datos del usuario de localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
    
            // Redirige al login después de cerrar sesión
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
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
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Bienvenido, {userName}
                                </a>
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
                            <>
                                <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Mi Cuenta
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/register">Registrarse</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/login">Iniciar Sesión</Link>
                                    </li>
                                </ul>
                            </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
