import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { Global } from '../../../../helpers/Global';

registerLocale('es', es);

export const Sorteo = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const handleDateChange = (date) => {
        setFechaSeleccionada(date);
    };

    const agendarSorteo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            const fechaSorteo = fechaSeleccionada
                ? fechaSeleccionada.toISOString().split('T')[0] // Formato YYYY-MM-DD
                : null;

            if (!fechaSorteo) {
                throw new Error('Debes seleccionar una fecha para el sorteo.');
            }

            const response = await fetch(Global.url + 'sorteo/generarSorteo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ fechaSorteo }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agendar el sorteo.');
            }

            const data = await response.json();
            setResultado({ ...data, fechaSorteo });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='sorteo-container'>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Agendar Sorteo</header>
            </div>

            <div className="form-container">
                <form onSubmit={agendarSorteo}>
                    <div className='calendar_container'>
                        <DatePicker
                            selected={fechaSeleccionada}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className='date-picker_sorteo'
                            locale="es"
                            inline
                        />
                    </div>
                    <button type="submit" className='agendar__button' disabled={loading}>
                        {loading ? 'Agendando sorteo...' : 'Agendar Sorteo'}
                    </button>
                </form>
                {error && <p className='card_sorteo-agendado csa_p'>{error}</p>}
                {resultado && (
                    <div className='card_sorteo-agendado'>
                        <h3>¡Sorteo agendado con éxito!</h3>
                        <h4>{new Date(resultado.fechaSorteo).toLocaleDateString('es-ES')}</h4>
                    </div>
                )}
            </div>
        </div>
    );
};
