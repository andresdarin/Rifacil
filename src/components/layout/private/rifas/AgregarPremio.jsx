import React, { useState, useEffect } from 'react';
import { Global } from '../../../../helpers/Global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AgregarPremio = () => {
    const [descripcion, setDescripcion] = useState('');
    const [sorteos, setSorteos] = useState([]);
    const [sorteoSeleccionado, setSorteoSeleccionado] = useState('');
    const [ganadores, setGanadores] = useState([]);
    const [ganadorSeleccionado, setGanadorSeleccionado] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSorteos = async () => {
            try {
                const response = await fetch(Global.url + 'sorteo/listarSorteos', {
                    headers: { 'Authorization': token }
                });
                if (!response.ok) throw new Error('Error al cargar sorteos');
                const data = await response.json();
                setSorteos(data.sorteos);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchSorteos();
    }, []);

    const handleSorteoChange = async (sorteoId) => {
        setSorteoSeleccionado(sorteoId);

        try {
            const response = await fetch(Global.url + `sorteo/${sorteoId}/ganadores`, {
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error('Error al cargar ganadores');
            const data = await response.json();
            setGanadores(data.ganadores);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(Global.url + 'premio/agregarPremio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    descripcion,
                    sorteo: sorteoSeleccionado,
                    ganador: ganadorSeleccionado || null
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Premio agregado exitosamente');
                setDescripcion('');
                setSorteoSeleccionado('');
                setGanadorSeleccionado('');
            } else {
                toast.error(data.message || 'Error al agregar el premio');
            }
        } catch (error) {
            toast.error('Error en la conexión con el servidor');
        }
    };

    return (
        <div className="form-container">
            <h2>Agregar Premio</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción del Premio</label>
                    <input
                        type="text"
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sorteo">Sorteo</label>
                    <select
                        id="sorteo"
                        value={sorteoSeleccionado}
                        onChange={(e) => handleSorteoChange(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar sorteo</option>
                        {sorteos.map((sorteo) => (
                            <option key={sorteo._id} value={sorteo._id}>
                                {`Sorteo: ${new Date(sorteo.fechaSorteo).toLocaleDateString()}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Agregar Premio</button>
            </form>

            {/* Contenedor de notificaciones */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default AgregarPremio;
