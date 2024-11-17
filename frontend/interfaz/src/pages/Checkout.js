import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api'; // Importar la API para obtener datos del usuario
import { useCart } from '../contexts/CartContext'; // Contexto para gestionar el carrito
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        comuna: '',
        region: '',
        email: '',
        telefono: '',
        rut_persona: '', // Campo adicional para identificar al usuario
    });
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const { cartItems, clearCart } = useCart(); // Obtener productos del carrito y método para limpiar el carrito
    const navigate = useNavigate();

    // Obtener datos del usuario al cargar el componente
    useEffect(() => {
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
    }, []);

    // Calcular el total del carrito
    useEffect(() => {
        const calculateTotal = () => {
            const totalAmount = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
            setTotal(totalAmount);
        };

        calculateTotal();
    }, [cartItems]);

    const handlePurchase = async () => {
        try {
            // Simulación de llamada al backend para registrar la compra
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

            alert('Compra realizada con éxito. Se ha registrado en tu historial.');
            clearCart(); // Limpia el carrito después de la compra
            navigate('/'); // Redirige al usuario a la página principal
        } catch (error) {
            console.error(error);
            setError('Error al realizar la compra.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Checkout</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {/* Datos del usuario */}
                <div className="col-md-6">
                    <h4>Información del Cliente</h4>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</li>
                        <li className="list-group-item"><strong>Dirección:</strong> {userData.direccion}, {userData.comuna}, {userData.region}</li>
                        <li className="list-group-item"><strong>Email:</strong> {userData.email}</li>
                        <li className="list-group-item"><strong>Teléfono:</strong> {userData.telefono}</li>
                        <li className="list-group-item"><strong>RUT:</strong> {userData.rut_persona}</li>
                    </ul>
                </div>

                {/* Productos del carrito */}
                <div className="col-md-6">
                    <h4>Productos en el Carrito</h4>
                    <ul className="list-group">
                        {cartItems.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    {/* Mostrar la imagen junto al nombre */}
                                    <img
                                        src={item.imagen}
                                        alt={item.nombre}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                    />
                                    {item.nombre} (x{item.quantity})
                                </div>
                                <span>${(item.precio * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h5 className="mt-3">Total: ${total.toFixed(2)}</h5>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-success" onClick={handlePurchase}>
                    Confirmar Compra
                </button>
            </div>
        </div>
    );
};

export default Checkout;
