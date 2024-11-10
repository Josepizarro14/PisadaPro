import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { userApi } from '../services/api';
import '../styles/styles.css';


const Navbar = () => {
    const { user, logout } = useUser();
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);

    const handleLogout = async () => {
        if (isAuthenticated) {
            try {
                const response = await userApi.post('/logout');
                if (response.status === 200) {
                    localStorage.clear();
                    logout();
                    navigate('/login');
                } else {
                    console.error('Error al cerrar sesión:', response.status);
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link className="navbar-brand" to="/">PisadaPro</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><Link className="nav-link" to="/category/todos">Todas las zapatillas</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/category/mujer">Mujer</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/category/hombre">Hombre</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/category/nino">Niño</Link></li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                                    {user?.userName || localStorage.getItem('userName')}
                                </span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/update-account">Actualizar cuenta</Link></li>
                                    <li><Link className="dropdown-item" to="/order-history">Historial de pedidos</Link></li>
                                    {userRole === 'administrador' && (
                                        <>
                                            <li><Link className="dropdown-item" to="/admin-panel">Panel de control</Link></li>
                                            <li><Link className="dropdown-item" to="/product-manager">Inventario</Link></li>
                                        </>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item dropdown">
                                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">Mi Cuenta</span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/register">Registrarse</Link></li>
                                    <li><Link className="dropdown-item" to="/login">Iniciar Sesión</Link></li>
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
