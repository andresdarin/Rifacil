import React, { createContext, useEffect, useState } from 'react';

// Crear el contexto del carrito
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(cartItem => cartItem._id === item._id);

            if (existingItem) {
                return prevItems.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item._id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    // Función para calcular el total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, updateQuantity, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
