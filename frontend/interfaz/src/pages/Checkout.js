// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api'; // API para obtener datos del usuario
import { useCart } from '../contexts/CartContext'; // Contexto para el carrito
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLock } from 'react-icons/fa'; // Íconos para los campos

const Checkout = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        comuna: '',
        region: '',
        email: '',
        telefono: '',
        rut_persona: '',
    });
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Verificar autenticación

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUserData = async () => {
                try {
                    const response = await userApi.get('/user');
                    setUserData(response.data);
                } catch (error) {
                    console.error(error);
                    setError('Error al cargar los datos del usuario.');
                }
            };

            fetchUserData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const calculateTotal = () => {
            const totalAmount = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
            setTotal(totalAmount);
        };

        calculateTotal();
    }, [cartItems]);

    const handlePurchase = async () => {
        try {
            if (!isAuthenticated) {
                const registrationData = {
                    rut_persona: userData.rut_persona,
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    direccion: userData.direccion,
                    comuna: userData.comuna,
                    region: userData.region,
                    email: userData.email,
                    telefono: userData.telefono,
                    contrasena: 'defaultPassword123', // Puede ser una contraseña generada o pedida por el usuario
                };
                await userApi.post('/register', registrationData);
                await handleLogin(userData.email, 'defaultPassword123');
            }

            const purchaseData = {
                productos: cartItems.map(item => ({
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    precio: item.precio,
                    categoria: item.categoria,
                    cantidad: item.quantity,
                    imagen: item.imagen,
                })),
                total,
                fecha: new Date().toISOString(),
                rut_persona: userData.rut_persona,
            };

            await userApi.post('/purchase', purchaseData);

            alert('Compra realizada con éxito.');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            setError('Error al realizar la compra.');
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await userApi.post('/login', { email, password }, { withCredentials: true });
            if (response.data.message === 'Inicio de sesión exitoso.') {
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userName', response.data.nombre);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('authToken', response.data.token);
            } else {
                setError('Error en el inicio de sesión.');
            }
        } catch (error) {
            setError('Error al iniciar sesión.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Checkout</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {/* Si el usuario no está autenticado, mostramos el formulario de registro */}
                <div className="col-md-6">
                    <h4 className="mb-3">Información del Cliente</h4>
                    {!isAuthenticated ? (
                        <div className="card p-4">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUserAlt /></span>
                                        <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellido</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUserAlt /></span>
                                        <input type="text" name="apellido" value={userData.apellido} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dirección</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                                        <input type="text" name="direccion" value={userData.direccion} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Comuna</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                                        <input type="text" name="comuna" value={userData.comuna} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Región</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                                        <input type="text" name="region" value={userData.region} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaEnvelope /></span>
                                        <input type="email" name="email" value={userData.email} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaPhoneAlt /></span>
                                        <input type="text" name="telefono" value={userData.telefono} onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaLock /></span>
                                        <input type="password" name="contrasena" onChange={handleChange} className="form-control" required />
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="card p-4">
                            <h4>Datos Cargados</h4>
                            <ul className="list-group">
                                <li className="list-group-item"><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</li>
                                <li className="list-group-item"><strong>Dirección:</strong> {userData.direccion}</li>
                                <li className="list-group-item"><strong>Email:</strong> {userData.email}</li>
                                <li className="list-group-item"><strong>Teléfono:</strong> {userData.telefono}</li>
                                <li className="list-group-item"><strong>Comuna:</strong> {userData.comuna}</li>
                                <li className="list-group-item"><strong>Región:</strong> {userData.region}</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Productos del carrito */}
                <div className="col-md-6">
                    <h4>Productos en el Carrito</h4>
                    <ul className="list-group">
                        {cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={item.imagen} alt={item.nombre} className="img-thumbnail" width="50" />
                                    <div className="ms-3">
                                        <strong>{item.nombre}</strong>
                                        <p className="mb-0">{item.descripcion}</p>
                                    </div>
                                </div>
                                <span>{item.precio} x {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <h4 className="mt-3">Total: ${total}</h4>
                    <button className="btn btn-primary mt-3" onClick={handlePurchase}>Realizar Compra</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
