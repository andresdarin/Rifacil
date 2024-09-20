import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';


export const ListadoVendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Estado para la página

    const fetchVendedores = async (page) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró un token de autorización.');
            }

            const response = await fetch(`${Global.url}usuario/list/${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching vendedores');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.users)) {
                setVendedores(data.users);
            } else {
                setError('No se pudieron obtener los vendedores');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendedores(page);
    }, [page]); // Agregar page como dependencia

    if (loading) return <div>Cargando vendedores...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Listado de Vendedores</h1>
            <ul>
                {vendedores.length > 0 ? (
                    vendedores.map((vendedor) => (
                        <li key={vendedor._id}>
                            {vendedor.nombre} - {vendedor.email}
                        </li>
                    ))
                ) : (
                    <li>No se encontraron vendedores</li>
                )}
            </ul>
        </div>
    );
};
