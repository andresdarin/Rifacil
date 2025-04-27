import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CartContext } from '../../../../context/CartProvider';
import { Global } from '../../../../helpers/Global';

export const Carrito = () => {
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const { cartItems, removeItem, clearCart, updateQuantity } = useContext(CartContext);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0).toFixed(2);
    };

    const handleProceedToCheckout = () => {
        // Redirigir al usuario a la página de checkout
        navigate('/tienda/checkout');
    };

    return (
        <div>
            <div className="container-banner__productos">
                <header className="header__productos header__carrito">Carrito de Compras</header>
            </div>

            <div className="cart-container">
                {cartItems.length > 0 ? (
                    <>
                        <ul className="cart-list">
                            {cartItems.map((item) => (
                                <li key={item._id} className="cart-item">
                                    <img
                                        src={item.imagen ? `${Global.url}uploads/${item.imagen}` : '../assets/img/user.png'}
                                        alt={item.nombreProducto}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h2 className="cart-item-title">{item.nombreProducto}</h2>
                                        <p className="cart-item-price">Precio: ${item.precio}</p>
                                    </div>
                                    <div className="cart-item-quantity-container">
                                        <button
                                            className="cart-quantity-button"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)} // Disminuir cantidad
                                            disabled={item.quantity === 1} // Desactivar si es la última unidad
                                        >
                                            <i className="fa-solid fa-minus cart-minus"></i>
                                        </button>
                                        <h2 className="cart-item-quantity">{item.quantity}</h2>
                                        <button
                                            className="cart-quantity-button cart-plus"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)} // Aumentar cantidad
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                    <button
                                        className="cart-remove-item-button"
                                        onClick={() => removeItem(item._id)}
                                    >
                                        <i className="fa fa-trash" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <h3 className="cart-total">Total: ${calculateTotal()}</h3>
                            <button className="cart-clear-button" onClick={clearCart}>
                                <i className="fa-solid fa-eraser"></i>
                            </button>
                        </div>
                        <button className="proceed-to-checkout-button" onClick={handleProceedToCheckout}>
                            Proceder con la compra
                        </button>
                    </>
                ) : (
                    <p className="cart-empty-message">El carrito está vacío.</p>
                )}
            </div>
        </div>
    );
};

export default Carrito;