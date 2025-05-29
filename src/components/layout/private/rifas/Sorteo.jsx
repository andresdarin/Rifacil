import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { format, parseISO } from 'date-fns';
import { Global } from '../../../../helpers/Global';

registerLocale('es', es);

export const Sorteo = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        return () => { document.body.style.backgroundImage = ''; };
    }, []);

    const handleDateChange = date => setFechaSeleccionada(date);

    const agendarSorteo = async e => {
        e.preventDefault();
        if (!fechaSeleccionada) {
            setError('Debes seleccionar una fecha para el sorteo.');
            return;
        }
        setLoading(true);
        setError(null);
        setResultado(null);

        const fechaSorteo = `${fechaSeleccionada.getFullYear()}-${String(
            fechaSeleccionada.getMonth() + 1
        ).padStart(2, '0')}-${String(fechaSeleccionada.getDate()).padStart(2, '0')}`;

        try {
            const resp = await fetch(Global.url + 'sorteo/generarSorteo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ fechaSorteo }),
            });

            const { sorteo, message } = await resp.json();
            if (!resp.ok) throw new Error(message);

            setResultado(sorteo);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='sorteo-container'>
            <div className="container-banner__vendedor">
                <header className="header__vendedor header__sortear">Agendar Sorteo</header>
            </div>
            <div className="form-container">
                <form onSubmit={agendarSorteo}>
                    <div className='calendar_container'>
                        <DatePicker
                            selected={fechaSeleccionada}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
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
                        <h4>
                            {format(
                                parseISO(resultado.fechaSorteo),
                                'dd.MM.yy',
                                { locale: es }
                            )}
                        </h4>
                    </div>
                )}
            </div>
        </div>
    );
};
