import React, { useState, useEffect } from 'react';
import ListadoRifas from './ListadoRifas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Global } from '../../../../helpers/Global';

export const CrearRifa = () => {
    const [contador, setContador] = useState(4);
    const [precio, setPrecio] = useState('');
    const [fecha, setFecha] = useState(null);
    const [message, setMessage] = useState(null);              // Mensaje de éxito o error
    const [refreshList, setRefreshList] = useState(false);     // Trigger para refrescar listado
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        return () => { document.body.style.backgroundImage = ''; };
    }, []);

    const incrementar = () => setContador(prev => prev + 1);
    const decrementar = () => setContador(prev => (prev > 1 ? prev - 1 : prev));

    const handlePrecioChange = e => {
        const value = e.target.value;
        if (value === '' || Number(value) >= 0) setPrecio(value);
    };

    const handleFechaChange = date => {
        const today = new Date();
        if (date >= today) setFecha(date);
        else alert('La fecha no puede ser menor a hoy.');
    };

    const handleGenerarClick = async () => {
        if (precio <= 0 || contador <= 0 || !fecha) {
            alert('Completa todos los campos con valores válidos.');
            return;
        }

        try {
            const response = await fetch(Global.url + 'rifa/generarNumerosRifa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    cantidad: contador,
                    precioRifa: precio,
                    fecha: fecha.toISOString().split('T')[0],
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error servidor');

            setMessage({ type: 'success', text: `Se generaron ${data.rifas.length} rifas correctamente.` });
            setRefreshList(prev => !prev);  // Trigger a refresh en ListadoRifas
            // Reset campos
            setContador(4);
            setPrecio('');
            setFecha(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }

        // Quitar mensaje tras 3 segundos
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = e => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) setContador(value === '' ? '' : parseInt(value, 10));
    };

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className="header__vendedor header__alta-rifa">Alta</header>
            </div>

            <div className="contador__controls card_rifa">
                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'
                        }`}> {message.text} </div>
                )}
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
                    <h2 className="contador__titulo contador__titulo_generar">Precio de la rifa</h2>
                    <i className="fas fa-usd currency" aria-hidden="true"></i>
                    <input
                        type="number"
                        className="input_precio"
                        value={precio}
                        onChange={handlePrecioChange}
                        min="0"
                    />

                    <h2 className="contador__titulo contador__titulo_generar">Fecha de sorteo</h2>
                    <i className="fas fa-calendar currency"></i>
                    <DatePicker
                        selected={fecha}
                        onChange={handleFechaChange}
                        minDate={new Date()}
                        dateFormat="dd-MM-yyyy"
                        calendarClassName="custom-datepicker"
                        className="input_fecha-crear input_fecha--crear"
                    />
                </div>

                <button className="generar__button" onClick={handleGenerarClick}>
                    Generar
                </button>
            </div>

            {/* Pasamos refreshList como prop para que ListadoRifas recargue */}
            <ListadoRifas refresh={refreshList} />
        </div>
    );
};
