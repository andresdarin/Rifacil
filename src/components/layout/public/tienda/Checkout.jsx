import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CartContext } from '../../../../context/CartProvider';
import mercadoPagoIcon from '../../../../assets/img/mercado-pago-icon.png';
import backToChartIcon from '../../../../assets/img/back-to-chart.png';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, calculateTotal } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const [preferenceId, setPreferenceId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        initMercadoPago('TEST-d4105872-b1e3-4e6b-862e-5c9ca2729593', { locale: 'es-AR' });
    }, []);

    // Función única para crear preferencia y redirigir
    const handleMercadoPago = async () => {
        if (isCreating) return;             // evita doble clic
        setIsCreating(true);

        // Si ya tenemos preferenceId, redirigimos inmediatamente:
        if (preferenceId) {
            window.location.href = preferenceId;
            return;
        }

        // Si no, la creamos:
        const total = calculateTotal();
        if (cartItems.length === 0 || total <= 0) {
            alert('No hay nada para pagar');
            setIsCreating(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:4001/api/pago/procesarPago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({
                    productos: cartItems.map(item => ({
                        _id: item._id,
                        precio: item.precio,
                        quantity: item.quantity
                    }))
                })
            });

            const data = await res.json();
            if (!res.ok) {
                console.error('Error al crear preferencia:', data);
                alert('No se pudo iniciar el pago');
            } else {
                setPreferenceId(data.init_point);
                window.location.href = data.init_point;
            }
        } catch (err) {
            console.error('Error de red al crear preferencia:', err);
            alert('Error de conexión al procesar el pago');
        } finally {
            setIsCreating(false);
        }
    };

    const handleContinueShopping = () => {
        navigate('/tienda');
    };

    return (
        <div>
            <div className="container-banner__productos">
                <header className="header__productos header__checkout">Checkout</header>
            </div>

            <div className="checkout-container">
                <div className="checkout-box">
                    <ul className="checkout-list">
                        <div className="checkout-title">
                            <h1>Revisa tu carrito:</h1>
                        </div>
                        {cartItems.map(item => (
                            <li key={item._id} className="checkout-item">
                                <span className="product-name">{item.nombreProducto}</span>
                                <span className="product-price">${item.precio}</span>
                                <span className="product-quantity">x {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="checkout-total">
                        <h3>Total: ${calculateTotal()}</h3>
                    </div>
                </div>

                <div className="btn-mercado-pago-container">
                    <button onClick={handleContinueShopping} className="btn-mercado-pago">
                        <img src={backToChartIcon} alt="Volver al carrito" />
                    </button>

                    {/* Siempre mostramos el botón de MercadoPago */}
                    <button
                        onClick={handleMercadoPago}
                        className="btn-mercado-pago"
                        disabled={isCreating}
                    >
                        <img src={mercadoPagoIcon} alt="Pagar con MercadoPago" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
