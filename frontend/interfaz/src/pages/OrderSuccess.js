import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { cartApi } from '../services/api'; // Suponiendo que tienes un archivo de configuración para axios

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderStatus, setOrderStatus] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);

    // Obtener el order_id de los parámetros de la URL
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('order_id');
    const errorParam = searchParams.get('error');

    useEffect(() => {
        if (errorParam) {
            setError(errorParam);  // Si hay un error, lo mostramos
            return;
        }

        if (orderId) {
            // Llamada a la API con axios para obtener los detalles de la compra
            cartApi.get(`/get-order-details/${orderId}`)
                .then(response => {
                    const data = response.data;
                    if (data && data.estado === 'pagada') {
                        setOrderStatus('pagada');
                        setOrderDetails(data);
                    } else {
                        setOrderStatus('error');
                        setError('No se pudo verificar la compra.');
                    }
                })
                .catch((err) => {
                    console.error('Error during the request:', err);
                    setOrderStatus('error');
                    setError('Hubo un problema al obtener los detalles de la compra.');
                });
        }
    }, [orderId, errorParam]);

    const handleRedirectHome = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    {orderStatus === 'pagada' ? (
                        <div className="alert alert-success">
                            <h2><FaCheckCircle /> ¡Compra exitosa!</h2>
                            <p>Tu pedido se ha procesado correctamente. Gracias por tu compra.</p>
                            <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
                            <p><strong>Compra ID:</strong> {orderDetails ? orderDetails.id : 'Desconocido'}</p>

                            {/* Mostrar los productos de la compra */}
                            <div className="products-list">
                                {orderDetails && orderDetails.productos && orderDetails.productos.length > 0 ? (
                                    orderDetails.productos.map((producto, index) => (
                                        <div key={index} className="product-item">
                                            <img src={producto.imagen} alt={producto.nombre_zapatilla} width="100" />
                                            <h5>{producto.nombre_zapatilla}</h5>
                                            <p>{producto.descripcion}</p>
                                            <p><strong>Precio:</strong> ${producto.precio}</p>
                                            <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                                            <p><strong>Talla:</strong> {producto.talla}</p> {/* Mostrar la talla */}
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron productos en tu compra.</p>
                                )}
                            </div>

                            <button className="btn btn-primary" onClick={handleRedirectHome}>
                                Volver al inicio
                            </button>
                        </div>
                    ) : orderStatus === 'error' || error ? (
                        <div className="alert alert-danger">
                            <h2><FaTimesCircle /> Error en la compra</h2>
                            <p>{error || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'}</p>
                            <button className="btn btn-primary" onClick={handleRedirectHome}>
                                Volver al inicio
                            </button>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <h2>Cargando...</h2>
                            <p>Estamos verificando tu compra...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
