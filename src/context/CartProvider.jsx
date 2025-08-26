import React, { createContext, useEffect, useState } from 'react';

// Crear el contexto del carrito
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item) => {
        setCartItems((prev) => {
            // Detectar tipo
            const tipo = item.precioRifa !== undefined ? 'rifa' : 'producto';
            const enriched = { ...item, tipo };
            const exists = prev.find(
                (i) => i._id === enriched._id && i.tipo === enriched.tipo
            );
            if (exists) {
                return prev.map((i) =>
                    i._id === enriched._id && i.tipo === enriched.tipo
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...enriched, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setCartItems((prev) =>
            prev
                .map((i) =>
                    i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setCartItems([]);

    const updateQuantity = (itemId, newQty) => {
        setCartItems((prev) =>
            prev
                .map((i) =>
                    i._id === itemId ? { ...i, quantity: newQty } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const unitPrice = item.precioRifa
                ? parseFloat(item.precioRifa) || 0
                : parseFloat(item.precio) || 0;
            return sum + unitPrice * item.quantity;
        }, 0);
    };

    console.log('Carrito antes de sumar:', cartItems);



    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                removeItem,
                clearCart,
                updateQuantity,
                calculateTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
