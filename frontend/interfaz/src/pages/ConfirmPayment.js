import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { userApi, cartApi } from '../services/api'; // API para obtener datos del usuario y carrito

const ConfirmPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart } = useCart();
    const [total, setTotal] = useState(0);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [error, setError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardError, setCardError] = useState('');
    const [tallas, setTallas] = useState({}); // Estado para las tallas

    const purchaseData = location.state?.purchaseData;

    useEffect(() => {
        if (!purchaseData || !purchaseData.productos) {
            console.error("No se recibieron datos de compra.");
            navigate('/checkout'); // Redirige si no hay datos
        } else {
            console.log("Datos recibidos para la confirmación:", purchaseData);
            setTotal(purchaseData.total);

            // Inicializar el estado de tallas
            const initialTallas = {};
            purchaseData.productos.forEach((producto) => {
                initialTallas[producto.id] = ''; // Cada producto comienza sin talla seleccionada
            });
            setTallas(initialTallas);
        }
    }, [purchaseData, navigate]);

    // Validación del número de tarjeta (algoritmo de Luhn)
    const validateCardNumber = (number) => {
        let sum = 0;
        let shouldDouble = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));
            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const handleConfirmPayment = async () => {
        // Validar tallas seleccionadas
        const tallasFaltantes = Object.values(tallas).some((talla) => talla === '');
        if (tallasFaltantes) {
            setError('Por favor, selecciona una talla para cada producto.');
            return;
        }

        // Validar tarjeta
        if (!validateCardNumber(cardNumber)) {
            setCardError('El número de tarjeta no es válido.');
            return;
        }

        if (!expiryDate || !cvv) {
            setCardError('Por favor, ingrese la fecha de expiración y el CVV.');
            return;
        }

        setCardError(''); // Limpiar errores

        try {
            const response = await cartApi.post('/pay', {
                cliente_email: purchaseData.cliente_email,
                productos: purchaseData.productos.map((producto) => ({
                    ...producto,
                    talla: tallas[producto.id],
                })),
                tarjeta_credito: {
                    numero: cardNumber,
                    fecha_expiracion: expiryDate,
                    cvv: cvv,
                },
            }, { withCredentials: true });

            const { url, token } = response.data;

            if (url && token) {
                window.location.href = `${url}?token_ws=${token}`;
            } else {
                setError('Hubo un problema al generar la transacción de pago.');
            }
        } catch (error) {
            console.error(error);
            setError('Error al iniciar el proceso de pago.');
        }
    };

    const handleTallaChange = (productId, talla) => {
        setTallas((prevTallas) => ({
            ...prevTallas,
            [productId]: talla,
        }));
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
                                <li key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <img src={item.imagen} alt={item.nombre_zapatilla} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            {item.nombre_zapatilla}
                                        </div>
                                        <span className="badge bg-primary rounded-pill">${item.precio}</span>
                                    </div>
                                    <div className="mt-2">
                                        <label className="form-label">Talla</label>
                                        <select
                                            className="form-select"
                                            value={tallas[item.id] || ''}
                                            onChange={(e) => handleTallaChange(item.id, e.target.value)}
                                        >
                                            <option value="">Selecciona una talla</option>
                                            {item.tallas_disponibles.map((talla) => (
                                                <option key={talla} value={talla}>
                                                    {talla}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <h4 className="mt-3">Total: ${total}</h4>
                    </div>
                </div>

                <div className="col-md-6">
                    <h4 className="mb-3">Método de Pago</h4>
                    <div className="card p-4">
                        {/* Campo para ingresar número de tarjeta */}
                        <div className="mb-3">
                            <label className="form-label">Número de Tarjeta</label>
                            <input
                                type="text"
                                className="form-control"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                maxLength="16"
                                placeholder="Ingresa el número de tarjeta"
                                required
                            />
                        </div>

                        {/* Campo para ingresar fecha de expiración */}
                        <div className="mb-3">
                            <label className="form-label">Fecha de Expiración</label>
                            <input
                                type="month"
                                className="form-control"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo para ingresar CVV */}
                        <div className="mb-3">
                            <label className="form-label">CVV</label>
                            <input
                                type="text"
                                className="form-control"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength="3"
                                placeholder="Ingresa el CVV"
                                required
                            />
                        </div>

                        {/* Mostrar error de validación de tarjeta */}
                        {cardError && <div className="alert alert-danger">{cardError}</div>}

                        <button className="btn btn-success w-100" onClick={handleConfirmPayment}>Confirmar Pago</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPayment;
