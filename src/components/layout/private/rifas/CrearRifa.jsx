import React, { useState, useEffect } from 'react';
import ListadoRifas from './ListadoRifas';
import DatePicker from "react-datepicker"; // Importar el componente DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Importar los estilos de react-datepicker
import { Global } from '../../../../helpers/Global';

export const CrearRifa = () => {
    const [contador, setContador] = useState(4);
    const [precio, setPrecio] = useState('');
    const [fecha, setFecha] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    // Incrementar contador
    const incrementar = () => setContador(contador + 1);

    // Decrementar contador solo si es mayor que 1
    const decrementar = () => {
        if (contador > 1) {
            setContador(contador - 1);
        }
    };

    // Función para manejar el cambio en el input de precio, asegurando que no sea negativo
    const handlePrecioChange = (e) => {
        const value = e.target.value;
        if (value >= 0 || value === '') {  // Asegurar que no se ingresen valores negativos
            setPrecio(value);
        }
    };

    // Función para manejar el cambio en el DatePicker, asegurando que no sea menor a la fecha actual
    const handleFechaChange = (date) => {
        const today = new Date(); // Obtener la fecha actual
        if (date >= today) {
            setFecha(date);
        } else {
            alert("La fecha no puede ser menor a hoy.");
        }
    };

    // Función para manejar el click en el botón "Generar"
    const handleGenerarClick = async () => {
        if (precio <= 0 || contador <= 0) {
            alert("El precio y la cantidad de rifas deben ser mayores a 0");
        } else {
            try {
                const response = await fetch(Global.url + 'rifa/generarNumerosRifa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        cantidad: contador,
                        precioRifa: precio,
                        fecha: fecha ? fecha.toLocaleDateString('es-ES') : null,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Maneja la respuesta exitosa
                    console.log(data.rifas); // Aquí puedes mostrar las rifas generadas
                } else {
                    // Maneja los errores del servidor
                    alert(data.message);
                }
            } catch (error) {
                // Maneja errores de red o problemas con la solicitud
                console.error('Error al generar las rifas:', error);
                alert('Hubo un problema al generar las rifas. Intenta nuevamente.');
            }
        }
    };

    // Función para manejar el cambio en el input de contador
    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {  // Asegurarse de que solo se ingresen números
            setContador(value === '' ? '' : parseInt(value, 10));
        }
    };

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Alta</header>
            </div>

            <div className="contador__controls card_rifa">
                <div className="contador__numero-container">
                    <h1 className="contador__titulo titulo_principal">Cuántas rifas quieres generar?</h1>
                    <button className="counter_icon_minus" onClick={decrementar}>
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    </button>
                    <input
                        type="text"
                        value={contador}
                        onChange={handleChange}
                        className="counter_number"
                    />
                    <button className="counter_icon_plus" onClick={incrementar}>
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                </div>

                <div className="precio_fecha">
                    <h2 className="contador__titulo">Precio de la rifa</h2>
                    <i className="fas fa-usd currency" aria-hidden="true"></i>
                    <input
                        type="number"
                        className="input_precio"
                        value={precio}
                        onChange={handlePrecioChange}
                        min="0"
                    />

                    <h2 className="contador__titulo">Fecha de sorteo</h2>
                    <i className="fas fa-calendar currency"></i>
                    <DatePicker
                        selected={fecha}
                        onChange={handleFechaChange}
                        minDate={new Date()}
                        dateFormat="dd-MM-yyyy"
                        className="input_fecha-crear"
                    />
                </div>
                <button className="generar__button" onClick={handleGenerarClick}>
                    Generar
                </button>
            </div>
            <ListadoRifas />
        </div>
    );
};
