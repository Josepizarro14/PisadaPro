import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleRedirectHome = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <div className="alert alert-success">
                        <h2><FaCheckCircle /> ¡Compra exitosa!</h2>
                        <p>Tu pedido se ha procesado correctamente. Gracias por tu compra.</p>
                        <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
                        <button className="btn btn-primary" onClick={handleRedirectHome}>
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
