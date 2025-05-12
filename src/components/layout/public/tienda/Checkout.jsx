import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CartContext } from '../../../../context/CartProvider';
import mercadoPagoIcon from '../../../../assets/img/mercado-pago-icon.png';
import backToChartIcon from '../../../../assets/img/back-to-chart.png';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, calculateTotal, clearCart } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const [isCreating, setIsCreating] = useState(false);


    useEffect(() => {
        initMercadoPago('TEST-d4105872-b1e3-4e6b-862e-5c9ca2729593', { locale: 'es-AR' });
    }, []);

    const handleMercadoPago = async () => {
        if (isCreating) return;
        setIsCreating(true);

        const total = calculateTotal();
        if (!cartItems.length || total <= 0) {
            alert('No hay nada para pagar');
            setIsCreating(false);
            return;
        }
        console.log("Enviando al backend:", cartItems.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            tipo: item.tipo || (item.precioRifa ? 'rifa' : 'producto')
        })));

        try {
            const res = await fetch(
                'http://localhost:4001/api/pago/procesarPago',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        productos: cartItems.map(item => ({
                            _id: item._id,
                            quantity: item.quantity,
                            tipo: item.tipo || (item.precioRifa ? 'rifa' : 'producto')
                        }))

                    })
                }
            );

            const data = await res.json();
            console.log('Pago response:', res.status, data);
            if (!res.ok) {
                alert(data.message || 'No se pudo iniciar el pago');
            } else {
                clearCart();
                window.location.href = data.init_point;
            }
        } catch (err) {
            console.error('Error de red:', err);
            alert('Error de conexión al procesar el pago');
        } finally {
            setIsCreating(false);
        }
    };

    const handleContinue = () => navigate('/tienda');

    return (
        <div>
            <div className="container-banner__productos">
                <header className="header__productos header__checkout">
                    Checkout
                </header>
            </div>

            <div className="checkout-container">
                <div className="checkout-box">
                    <div className="checkout-title">
                        <h1>Revisa tu carrito:</h1>
                    </div>
                    <ul className="checkout-list">
                        {cartItems.map((item) => {
                            const isRifa = item.tipo === 'rifa' || !!item.NumeroRifa;
                            const name = isRifa
                                ? `Rifa #${item.NumeroRifa ?? item._id}`
                                : item.nombreProducto;
                            const price = isRifa ? item.precioRifa : item.precio;
                            return (
                                <li key={item._id} className="checkout-item">
                                    <span className="product-name">{name}</span>
                                    <span className="product-price">${price}</span>
                                    <span className="product-quantity">x {item.quantity}</span>
                                </li>
                            );
                        })}

                    </ul>
                    <div className="checkout-total">
                        <h3>Total: ${calculateTotal()}</h3>
                    </div>
                </div>

                <div className="btn-mercado-pago-container">
                    <button onClick={handleContinue} className="btn-mercado-pago">
                        <img src={backToChartIcon} alt="Volver al carrito" />
                    </button>
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
