import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';
import DatePicker from 'react-datepicker';

export const Sortear = () => {
    const [mensaje, setMensaje] = useState(null); // Estado para el mensaje de respuesta
    const [error, setError] = useState(null); // Estado para errores
    const [fechaSorteo, setFechaSorteo] = useState(null);
    const token = localStorage.getItem('token')

    useEffect(() => {
        // Configurar fondo al montar el componente
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = ''; // Limpiar fondo al desmontar
        };
    }, []);

    const realizarSorteo = async () => {
        try {
            // Formatear la fecha a "YYYY-MM-DD"
            const fechaFormateada = fechaSorteo.toISOString().split('T')[0];

            const response = await fetch(Global.url + 'sorteo/realizarSorteo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ fechaSorteo: fechaFormateada }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si ocurre un error
                setError(data.message || 'Error al realizar el sorteo');
                return;
            }

            // Si la solicitud fue exitosa
            setMensaje(`¡Sorteo realizado exitosamente! Detalles: ${data.message}`);
            setError(null);
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div className='sorteo-container'>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Sortear</header>
            </div>
            <div className='calendar_container calendar_container__sortear'>
                <DatePicker
                    selected={fechaSorteo}
                    onChange={(date) => setFechaSorteo(date)}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker_sorteo"
                    inline
                />
                <button onClick={realizarSorteo} className="sortear__button">
                    Realizar Sorteo
                </button>
                {mensaje && <p className="sorteo-success">{mensaje}</p>}
                {error && <p className="card_sorteo-agendado">{error}</p>}
            </div>
        </div>
    );
};
