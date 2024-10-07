import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';
import '../styles/styles.css'; // Importa el archivo CSS

const Navbar = () => {
    const { user, logout } = useUser();
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false); // Estado para mostrar/ocultar el modal del carrito

    const handleLogout = async () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            try {
                const response = await api.post('/logout');
                if (response.status === 200) {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userEmail');
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

    const toggleCartModal = () => {
        setShowCart(!showCart); // Cambiar el estado para mostrar/ocultar el modal
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
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
                        <li className="nav-item">
                        <i class="fa-solid fa-cart-shopping nav-link" className="fa-solid fa-cart-shopping" style={{ cursor: 'pointer' }} onClick={toggleCartModal}></i>
                        </li>
                        
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

            {/* Modal del Carrito */}
            {showCart && (
                <div className="cart-modal">
                    <div className="cart-content">
                        <h3>Carrito de compras</h3>
                        <p>Agregue aquí sus productos</p>
                        <button onClick={toggleCartModal} className="btn btn-secondary">Cerrar</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
