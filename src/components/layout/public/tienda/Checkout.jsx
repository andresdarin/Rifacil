import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate para navegación
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { CartContext } from '../../../../context/CartProvider';
import { Global } from '../../../../helpers/Global';
import mercadoPagoIcon from '../../../../assets/img/mercado-pago-icon.png'; // Importa la imagen
import backToChartIcon from '../../../../assets/img/back-to-chart.png'; // Importa la imagen

const Checkout = () => {
    const navigate = useNavigate(); // Inicializar el hook de navegación

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const { cartItems, calculateTotal } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const [preferenceId, setPreferenceId] = useState(null);

    // Inicializa Mercado Pago con tu Public Key
    useEffect(() => {
        initMercadoPago('TU_PUBLIC_KEY_DE_MERCADO_PAGO', { locale: 'es-AR' });
    }, []);

    // Función para crear la preferencia de pago
    const createPreference = async () => {
        const total = calculateTotal();
        console.log('Monto calculado:', total);

        if (cartItems.length === 0 || total <= 0) {
            console.error('El carrito está vacío o el total es 0');
            return;
        }

        try {
            const response = await fetch('http://localhost:4001/api/pago/procesarPago', {
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

            const data = await response.json();
            if (!response.ok) {
                console.error('Error al crear la preferencia:', data);
                return;
            }

            console.log('Respuesta de MercadoPago:', data);
            setPreferenceId(data.init_point); // Guardar la URL de pago
        } catch (error) {
            console.error('Error al crear la preferencia:', error);
        }
    };


    // Llamar a la función para crear la preferencia solo cuando el carrito tenga productos
    useEffect(() => {
        if (cartItems.length > 0) {
            createPreference();
        }
    }, [cartItems]);

    // Función para redirigir al usuario a MercadoPago
    const handleRedirect = () => {
        if (preferenceId) {
            window.location.href = preferenceId; // Ahora preferenceId contiene la URL correcta
        } else {
            console.error('No se ha generado una URL de pago válida.');
        }
    };


    // Función para volver a la tienda
    const handleContinueShopping = () => {
        navigate('/tienda'); // Navegar a la tienda (ajusta la ruta según sea necesario)
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
                            <h1>Puedes continuar con el pago o volver al carrito...</h1>
                        </div>
                        {cartItems.map((item) => (
                            <li key={item._id} className="checkout-item">
                                <span className="product-name">{item.nombreProducto}</span>
                                <span className="product-price">${item.precio}</span>
                                <span className="product-quantity">x {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="checkout-total">
                        <h3>${calculateTotal()}</h3>
                    </div>

                </div>

                <div className="btn-mercado-pago-container">
                    <button onClick={handleContinueShopping} className="btn-mercado-pago">
                        <img src={backToChartIcon} alt="Volver al carrito" />
                    </button>
                    <button onClick={handleRedirect} className="btn-mercado-pago">
                        <img src={mercadoPagoIcon} alt="Pagar con MercadoPago" />
                    </button>
                </div>



            </div>
        </div>
    );
};

export default Checkout;
