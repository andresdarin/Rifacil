import React, { useEffect, useState, useContext } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { CartContext } from '../../../../context/CartProvider';
import { Global } from '../../../../helpers/Global';

const Checkout = () => {
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

    console.log("Token:", token);
    console.log("Carrito de compras:", cartItems);
    console.log("Total del carrito:", calculateTotal());
    console.log("Carrito enviado al backend:", JSON.stringify(cartItems, null, 2));

    // Inicializa Mercado Pago con tu Public Key
    useEffect(() => {
        initMercadoPago('TU_PUBLIC_KEY_DE_MERCADO_PAGO', { locale: 'es-AR' });
    }, []);

    // Función para crear la preferencia de pago
    const createPreference = async () => {
        if (cartItems.length === 0) {
            console.error('El carrito está vacío');
            return;
        }

        try {
            const response = await fetch(Global.url + `pago/procesarPago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ productos: cartItems.map(item => item._id) }) // Enviar solo los IDs de los productos
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error al crear la preferencia:', errorDetails);
                return;
            }

            const data = await response.json();
            setPreferenceId(data.init_point); // Guardar la URL de pago para redirigir al usuario
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
            window.location.href = preferenceId; // Redirigir al usuario a MercadoPago
        }
    };

    return (
        <div>
            <div className="container-banner__productos">
                <header className="header__productos">Checkout</header>
            </div>
            <ul>
                {cartItems.map((item) => (
                    <li key={item._id}>
                        {item.nombreProducto} - ${item.precio} x {item.quantity}
                    </li>
                ))}
            </ul>
            <h3>Total: ${calculateTotal()}</h3>

            {/* Mostrar el botón de redirección solo cuando haya un preferenceId */}
            {preferenceId && (
                <div>
                    <button
                        onClick={handleRedirect}
                        className="btn-mercado-pago"
                    >
                        Redirigir a MercadoPago
                    </button>
                </div>
            )}

            {/* Botón de pago de Mercado Pago, solo si la preferencia ha sido creada */}
            {/* (Opcional si prefieres solo usar el Wallet SDK) */}
            {/* {preferenceId && (
                <Wallet
                    initialization={{ preferenceId }}
                    customization={{ texts: { valueProp: 'security' } }}
                />
            )} */}
        </div>
    );
};

export default Checkout;
