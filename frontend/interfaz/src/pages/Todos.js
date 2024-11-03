import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/api'; // Asegúrate de que la ruta a api.js sea correcta
import '../styles/catalog.css'; // Personaliza los estilos en este archivo CSS

const Todos = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    // Obtener todos los productos al cargar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };
        fetchProducts();
    }, []);

    // Calcular el índice de los productos para la paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Todos los Productos</h2>
            <div className="row">
                {currentProducts.map((product) => (
                    <div key={product._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={product.imagen} className="card-img-top" alt={product.nombre} />
                            <div className="card-body">
                                <h5 className="card-title">{product.nombre}</h5>
                                <p className="card-text">{product.descripcion}</p>
                                <p className="card-text fw-bold">${product.precio}</p>
                                <button className="btn btn-primary">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Paginación */}
            <div className="pagination mt-4 d-flex justify-content-center">
                {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`btn mx-1 ${currentPage === number + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Todos;
