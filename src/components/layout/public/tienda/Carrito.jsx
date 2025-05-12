import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../../context/CartProvider';
import { Global } from '../../../../helpers/Global';

export const Carrito = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const { cartItems, removeItem, clearCart, updateQuantity } = useContext(CartContext);

    // Calcula el total usando precio o precioRifa, asegurando tipo numérico
    const calculateTotal = () => {
        return cartItems
            .reduce((total, item) => {
                const precioUnitario = Number(item.precio ?? item.precioRifa ?? 0);
                return total + precioUnitario * item.quantity;
            }, 0)
            .toFixed(2);
    };

    const handleProceedToCheckout = () => {
        // Aquí sería donde inicias la integración con MercadoPago
        // Suponiendo que MercadoPago redirige al usuario a una página de pago
        // o simplemente realiza el pago dentro del mismo flujo, puedes usar
        // un callback o promesa para limpiar el carrito después de la compra.
        // Simulación de éxito de pago
        processPayment().then((paymentStatus) => {
            if (paymentStatus === 'success') {
                clearCart();  // Limpia el carrito después de la compra
                navigate('/compra-exitosa');  // Redirige a una página de compra exitosa
            } else {
                navigate('/compra-fallida');  // Redirige en caso de fallo en el pago
            }
        });
    };

    const processPayment = async () => {
        // Aquí colocarías la lógica para interactuar con MercadoPago
        // Esta es una simulación
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('success');  // Simula un pago exitoso
            }, 2000);
        });
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
                            {cartItems.map((item) => {
                                const isRifa = item.precioRifa !== undefined;
                                const imageSrc = isRifa
                                    ? '/src/assets/img/generic-raffle.png'
                                    : (item.imagen ? `${Global.url}uploads/${item.imagen}` : '/src/assets/img/user.png');
                                const title = isRifa
                                    ? `Rifa Nº ${item.NumeroRifa ?? item._id}`
                                    : item.nombreProducto;

                                return (
                                    <li key={item._id} className="cart-item">
                                        <img
                                            src={imageSrc}
                                            alt={title}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <h2 className="cart-item-title">{title}</h2>
                                            <p className="cart-item-price">
                                                Precio: ${Number(item.precio ?? item.precioRifa ?? 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="cart-item-quantity-container">
                                            <button
                                                className="cart-quantity-button"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity === 1}
                                            >
                                                <i className="fa-solid fa-minus cart-minus"></i>
                                            </button>
                                            <h2 className="cart-item-quantity">{item.quantity}</h2>
                                            <button
                                                className="cart-quantity-button cart-plus"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                                );
                            })}
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
