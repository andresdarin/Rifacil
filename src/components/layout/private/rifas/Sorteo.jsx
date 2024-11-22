import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { Global } from '../../../../helpers/Global';
import Ruleta from './Ruleta';  // Importa el componente de la ruleta

registerLocale('es', es);

export const Sorteo = () => {
    const [formData, setFormData] = useState({ mes: '', año: '', participantes: '' });
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const participantes = formData.participantes.split(',').map(participante => participante.trim()).filter(Boolean);  // Convertir la lista de participantes en un array

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const handleDateChange = (date) => {
        if (date) {
            const mes = (date.getMonth() + 1).toString().padStart(2, '0');
            const año = date.getFullYear().toString();
            setFormData({ ...formData, mes, año });
            setFechaSeleccionada(date);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const realizarSorteo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            const response = await fetch(Global.url + 'sorteo/realizarSorteo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al realizar el sorteo');
            }

            const data = await response.json();
            setResultado(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='sorteo-container'>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Sorteo</header>
            </div>

            <div className="form-container">
                <form onSubmit={realizarSorteo}>
                    <div>
                        <DatePicker
                            selected={fechaSeleccionada}
                            onChange={handleDateChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            locale="es"
                            placeholderText="Selecciona Mes y Año"
                            className="datepicker-input"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            name="participantes"
                            value={formData.participantes}
                            onChange={handleChange}
                            placeholder="Lista de participantes separados por comas"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className='btn' disabled={loading}>
                        {loading ? 'Realizando sorteo...' : 'Realizar Sorteo'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {resultado && (
                    <div>
                        <h3>¡Sorteo realizado con éxito!</h3>
                        <p>Rifa Ganadora: {resultado.rifaGanadora.NumeroRifa}</p>
                        <p>Nombre del Ganador: {resultado.rifaGanadora.nombreParticipante}</p>
                        <p>Fecha del Sorteo: {resultado.rifaGanadora.FechaSorteo}</p>
                    </div>
                )}
            </div>

            {/* Agregar la ruleta con los participantes */}
            {participantes.length > 0 && <Ruleta participantes={participantes} />}
        </div>
    );
};
