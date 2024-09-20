import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const ListadoVendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

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

    const handleDelete = (id) => {
        // Implementa la lógica para eliminar un vendedor
        console.log(`Eliminar vendedor con id: ${id}`);
    };

    const handleEdit = (id) => {
        // Implementa la lógica para editar un vendedor
        console.log(`Editar vendedor con id: ${id}`);
    };

    if (loading) return <div>Cargando vendedores...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className='card-container__title'>Vendedores</h1>
            <div className="card-container">
                {vendedores.length > 0 ? (
                    vendedores.map((vendedor) => (
                        <div key={vendedor._id} className="card">
                            <div>
                                <h1>{vendedor.nombreCompleto}</h1>
                                <h4>{vendedor.email}</h4>
                            </div>

                            <div className="card-buttons">
                                <button className="edit-button" onClick={() => handleEdit(vendedor._id)}>
                                    <i class="fa fa-pencil" aria-hidden="true" />
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(vendedor._id)}>
                                    <i class="fa fa-trash" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron vendedores</p>
                )}
            </div>
        </div>
    );
};
