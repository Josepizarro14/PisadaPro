import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Obtener el carrito de localStorage o establecer un carrito vacío si no existe.
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Cada vez que cambie el carrito, guardarlo en localStorage.
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Agregar al carrito
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(
                (item) => item._id === product._id && item.talla === product.talla
            );
            if (existingProduct) {
                return prevItems.map((item) =>
                    item._id === product._id && item.talla === product.talla
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Eliminar del carrito por id y talla
    const removeFromCart = (itemId, talla) => {
        setCartItems((prevItems) => prevItems.filter(item => !(item._id === itemId && item.talla === talla)));
    };

    const clearCart = () => {
        setCartItems([]); // Establece el carrito vacío
        localStorage.removeItem('cartItems'); // Elimina el carrito del localStorage
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
