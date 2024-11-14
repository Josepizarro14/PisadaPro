// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { userApi } from '../services/api';
import '../styles/styles.css';

const Navbar = () => {
    const { user, logout } = useUser();
    const { cartItems, removeFromCart } = useCart();
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [showCartDropdown, setShowCartDropdown] = useState(false);

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

    const toggleCartDropdown = () => setShowCartDropdown(!showCartDropdown);

    // Nueva función para manejar la eliminación de elementos
    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
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
                        <li className="nav-item position-relative">
                            <button className="btn btn-cart" onClick={toggleCartDropdown}>
                                🛒 Carrito ({cartItems.length})
                            </button>
                            {showCartDropdown && (
                                <div className="cart-dropdown">
                                    <ul className={`list-group ${cartItems.length > 2 ? 'cart-dropdown-scrollable' : ''}`}>
                                        {cartItems.length > 0 ? (
                                            cartItems.map((item, index) => (
                                                <li key={index} className="list-group-item d-flex align-items-center">
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="cart-item-image me-3"
                                                    />
                                                    <div className="cart-item-details">
                                                        <span>{item.nombre}</span>
                                                        <br />
                                                        <small>Cantidad: {item.quantity}</small>
                                                    </div>
                                                    <button
                                                        className="btn btn-sm ms-auto"
                                                        onClick={() => handleRemoveItem(item._id)}
                                                    >
                                                        ❌
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item">Carrito vacío</li>
                                        )}
                                    </ul>
                                    <div className="dropdown-footer">
                                        <Link to="/cart" className="btn btn-primary btn-sm">Comprar carrito</Link>
                                    </div>
                                </div>
                            )}

                        </li>
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
