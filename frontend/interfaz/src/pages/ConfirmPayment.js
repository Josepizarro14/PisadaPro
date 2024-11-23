import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';

const ConfirmPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart } = useCart();
    const [total, setTotal] = useState(0);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [error, setError] = useState('');

    const purchaseData = location.state?.purchaseData;

    useEffect(() => {
        if (!purchaseData) {
            navigate('/checkout');  // Redirigir si no hay datos de compra
        } else {
            setTotal(purchaseData.total);
        }
    }, [purchaseData, navigate]);

    const handleConfirmPayment = async () => {
        try {
            // Aquí iría la lógica para procesar el pago con la API de Transbank o el backend
            setConfirmationMessage('¡Pago realizado con éxito! Gracias por tu compra.');
            clearCart();  // Limpiar el carrito después de la compra
            setTimeout(() => {
                navigate('/order-success');
            }, 3000);
        } catch (error) {
            console.error(error);
            setError('Error al procesar el pago.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Confirmación de Pago</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {confirmationMessage && <div className="alert alert-success">{confirmationMessage}</div>}

            <div className="row">
                <div className="col-md-6">
                    <h4 className="mb-3">Resumen de la Compra</h4>
                    <div className="card p-4">
                        <ul className="list-group">
                            {purchaseData?.productos.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.imagen} alt={item.nombre_zapatilla} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                        {item.nombre_zapatilla}
                                    </div>
                                    <span className="badge bg-primary rounded-pill">${item.precio}</span>
                                </li>
                            ))}
                        </ul>
                        <h4 className="mt-3">Total: ${total}</h4>
                    </div>
                </div>

                <div className="col-md-6">
                    <h4 className="mb-3">Método de Pago</h4>
                    <div className="card p-4">
                        <div className="mb-3">
                            <label className="form-label">Tarjeta de Crédito</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaCreditCard /></span>
                                {/* Mostrar solo los últimos 4 dígitos de la tarjeta */}
                                <input type="text" className="form-control" disabled value={`**** **** **** ${purchaseData?.tarjeta_credito.numero.slice(-4)}`} />
                            </div>
                        </div>
                        <button className="btn btn-success w-100" onClick={handleConfirmPayment}>Confirmar Pago</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ConfirmPayment;
