import React, { useState, useEffect } from 'react';
import { userApi, cartApi } from '../services/api'; // API para obtener datos del usuario y carrito
import { useCart } from '../contexts/CartContext'; // Contexto para el carrito
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'; // Íconos para los campos

const Checkout = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        direccion: '',
        comuna: '',
        region: '',
        email: '',
        telefono: '',
        rol: '',
    });
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Verificar autenticación

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUserData = async () => {
                try {
                    const response = await userApi.get('/userCheckout');
                    setUserData({
                        nombre: response.data.nombre,
                        direccion: response.data.direccion,
                        comuna: response.data.comuna,
                        region: response.data.region,
                        email: response.data.email,
                        telefono: response.data.telefono,
                        rol: response.data.rol,
                    });
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
            const purchaseData = {
                cliente_email: userData.email,
                productos: cartItems.map(item => ({
                    nombre_zapatilla: item.nombre,
                    descripcion: item.descripcion,
                    precio: item.precio,
                    categoria: item.categoria,
                    cantidad: item.quantity,
                    imagen: item.imagen,
                })),
                total,
                fecha: new Date().toISOString(),
                rut_cliente: userData.rut_persona,
                nombre_cliente: userData.nombre,
                direccion_cliente: userData.direccion,
                comuna_cliente: userData.comuna,
                region_cliente: userData.region,
                telefono_cliente: userData.telefono,
            };
    
            const response = await cartApi.post('/checkout', purchaseData);
    
            if (response.data.message === "Compra realizada con éxito") {
                setSuccessMessage('Compra realizada con éxito. ¡Gracias por tu compra!'); // Actualizar el mensaje de éxito
                clearCart();
                setTimeout(() => {
                    navigate('/'); // Redirigir después de 3 segundos
                }, 3000);
            } else {
                setError('Error al realizar la compra.');
            }
        } catch (error) {
            console.error(error);
            setError('Error al realizar la compra.');
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
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Mostrar mensaje de éxito */}
            <div className="row">
                <div className="col-md-6">
                    <h4 className="mb-3">Información del Cliente</h4>
                    <div className="card p-4">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaUserAlt /></span>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={userData.nombre}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su nombre.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Dirección</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaMapMarkerAlt /></span>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={userData.direccion}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su dirección.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Comuna</label>
                                <input
                                    type="text"
                                    name="comuna"
                                    value={userData.comuna}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su comuna.')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Región</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={userData.region}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su región.')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaEnvelope /></span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese un email válido.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaPhoneAlt /></span>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={userData.telefono}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                        onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su teléfono.')}
                                        onInput={(e) => e.target.setCustomValidity('')}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    <h4>Productos en el Carrito</h4>
                    <ul className="list-group">
                        {cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    {item.nombre}
                                </div>
                                <span className="badge bg-primary rounded-pill">${item.precio}</span>
                            </li>
                        ))}
                    </ul>
                    <h4 className="mt-3">Total: ${total}</h4>
                    <button className="btn btn-primary" onClick={handlePurchase}>Realizar Compra</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;