import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const Sortear = () => {
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [fechaSorteo, setFechaSorteo] = useState(null);
    const [proximosSorteos, setProximosSorteos] = useState([]);
    const token = localStorage.getItem('token');
    const [ganadores, setGanadores] = useState([]);


    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        fetch('http://localhost:4001/api/sorteo/sorteosFuturos')
            .then(res => res.json())
            .then(data => {
                if (data.sorteos) {
                    setProximosSorteos(data.sorteos);
                }
            })
            .catch(err => console.error('Error fetching próximos sorteos:', err));

        fetch(Global.url + 'sorteo/listarGanadores', {
            headers: { Authorization: token }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.sorteos) && data.sorteos.length > 0) {
                    const sorted = data.sorteos
                        .map(s => ({ ...s, fechaParsed: new Date(s.fechaSorteo) }))
                        .sort((a, b) => b.fechaParsed - a.fechaParsed);
                    const now = new Date();
                    const reciente = sorted.find(s => s.fechaParsed <= now) || sorted[0];
                    if (reciente && reciente.ganadores) {
                        setGanadores(reciente.ganadores.slice(0, 3));
                    }
                }
            })
            .catch(err => console.error('Error fetching ganadores:', err));

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        // Configurar fondo
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // Obtener próximos sorteos
        fetch('http://localhost:4001/api/sorteo/sorteosFuturos')
            .then(res => res.json())
            .then(data => {
                if (data.sorteos) {
                    setProximosSorteos(data.sorteos);
                }
            })
            .catch(err => console.error('Error fetching próximos sorteos:', err));

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const realizarSorteo = async () => {
        try {
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
                setError(data.message || 'Error al realizar el sorteo');
                return;
            }

            setMensaje(`¡${data.message}! puedes ver los detalles en la pagina principal.`);
            setError(null);
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div className='sorteo-container'>
            <div className="container-banner__productos">
                <header className="header__vendedor header__sortear">Sortear</header>
            </div>
            {ganadores.length > 0 && (
                <div className="ganadores-preview proximos-sorteos-sortear">
                    <strong>Felicitaciones!</strong>
                    <ul>
                        {ganadores.map((g, i) => (
                            <li style={{ listStyle: 'none' }} key={i}>{g.nombreParticipante || 'Desconocido'}</li>
                        ))}
                    </ul>
                </div>
            )
            }

            {/* Calendario y botón */}
            <div className='calendar_container calendar_container__sortear'>
                <DatePicker
                    selected={fechaSorteo}
                    onChange={(date) => setFechaSorteo(date)}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker_sorteo"
                    inline
                    highlightDates={proximosSorteos.map(sorteo => new Date(sorteo.fechaSorteo))}
                />
                <button onClick={realizarSorteo} className="sortear__button">
                    Realizar Sorteo
                </button>
                {mensaje && <p className="sorteo-success">{mensaje}</p>}
                {error && <p className="card_sorteo-agendado">{error}</p>}


                <div className='proximos-sorteos-sortear'>
                    <h3>Próximos Sorteos</h3>
                    {proximosSorteos.length > 0 ? (
                        <ul>
                            {proximosSorteos.map((sorteo) => (
                                <li key={sorteo.id}>
                                    {format(parseISO(sorteo.fechaSorteo), 'dd.MM.yyyy', { locale: es })}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay próximos sorteos.</p>
                    )}
                </div>
            </div>

        </div >
    );
};
