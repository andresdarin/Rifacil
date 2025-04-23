import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const RifasAsignadas = ({ vendedorId, año }) => {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {

        console.log('vendedorId', vendedorId);
        console.log('año', año);
        // Verificar que se ha recibido un vendedorId y año
        if (!vendedorId || !año) {

            setError("Faltan datos para realizar la consulta.");
            setLoading(false);
            return;
        }


        const fetchRifasAsignadas = async () => {
            try {

                if (!token) {
                    throw new Error('No se encontró un token de autenticación.');
                }

                // Hacer la solicitud POST al backend
                const response = await fetch(`${Global.url}rifa/rifas-por-vendedor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({ userId: vendedorId, año: año }), // Asegurarnos de que ambos valores se están enviando
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Para obtener más detalles del error
                    throw new Error(`Error al obtener las rifas: ${response.statusText}. Detalles: ${errorData.message}`);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    setRifas(data.data.numerosRifa);  // Aquí asumo que la respuesta contiene los números de las rifas
                } else {
                    throw new Error('No se encontraron rifas asignadas para este vendedor.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };


        fetchRifasAsignadas();
    }, [vendedorId, año]); // El efecto se dispara cuando vendedorId o año cambian

    if (loading) return <div>Cargando rifas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container-asignar">
            <h1> Rifas Asignadas </h1>

            <div className="rifas-list rifas-list-vendedor-profile">
                {loading ? (
                    <p className="rifa-loading">Cargando rifas...</p>
                ) : error ? (
                    <p className="rifa-error">{error}</p>
                ) : rifas.length === 0 ? (
                    <p className="rifa-vacio">No hay rifas asignadas para este vendedor.</p>
                ) : (
                    <ul className="rifa-list rifa-list-vendedor-profile ">
                        {rifas.map((numero, index) => (
                            <li key={index} className="rifa-item rifa-item-vendedor-profile">
                                {numero}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
