import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const RifasAsignadas = ({ vendedorId, año }) => {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!vendedorId || !año) {
            setError("Faltan datos para realizar la consulta.");
            setLoading(false);
            return;
        }

        const fetchRifasAsignadas = async () => {
            try {
                if (!token) throw new Error('No se encontró un token de autenticación.');

                const response = await fetch(`${Global.url}rifa/rifas-por-vendedor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({ userId: vendedorId, año }),
                });

                const data = await response.json();
                console.log('Respuesta de la API:', data); // Verifica la estructura de los datos aquí

                if (!response.ok) {
                    throw new Error(data.message || response.statusText);
                }

                if (data.status === 'success') {
                    console.log('Datos de rifas:', data.data.numerosRifa); // Asegúrate que `numerosRifa` esté presente
                    setRifas(data.data.numerosRifa);
                } else {
                    throw new Error('No se encontraron rifas asignadas para este vendedor.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };



        fetchRifasAsignadas();
    }, [vendedorId, año, token]);

    if (loading) return <div>Cargando rifas...</div>;
    if (error) return <div className="rifa-error">{error}</div>;
    if (rifas.length === 0) return <div className="rifa-vacio">No hay rifas asignadas para este vendedor.</div>;

    return (
        <div className="container-asignar">
            <h1>Rifas Asignadas</h1>
            <ul className="rifa-list rifa-list-vendedor-profile">
                {rifas.map(rifa => (
                    <li
                        key={rifa._id}
                        className={`rifa-item rifa-item-vendedor-profile rifa-item_profile ${rifa.pagoRealizado ? 'deshabilitada' : ''}`}

                    >
                        {rifa.numero}
                        {rifa.pagoRealizado}
                    </li>
                ))}
            </ul>

        </div>

    );
};
