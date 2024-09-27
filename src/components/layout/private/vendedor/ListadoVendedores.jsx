import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const ListadoVendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Estado para las páginas totales

    // Función para obtener la lista de vendedores
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
                throw new Error('Error al obtener los vendedores');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.users)) {
                setVendedores(data.users);
                setTotalPages(data.pages); // Asegúrate de usar `data.pages`
            } else {
                setError('No se pudieron obtener los vendedores');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar vendedores al montar el componente o cuando cambie la página
    useEffect(() => {
        fetchVendedores(page);
    }, [page]);

    const handleDelete = (id) => {
        console.log(`Eliminar vendedor con id: ${id}`);
    };

    const handleEdit = (id) => {
        console.log(`Editar vendedor con id: ${id}`);
    };

    // Función para cambiar de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) return <div>Cargando vendedores...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className='card-layout'>
                <h1 className='card-title-vertical'>Vendedores</h1>
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
                                        <i className="fa fa-pencil" aria-hidden="true" />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(vendedor._id)}>
                                        <i className="fa fa-trash" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron vendedores</p>
                    )}
                </div>
            </div>

            {/* Paginación */}
            <div className="pagination">
                <button className='arrow-pagination'
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                </button>
                <span>{page} de {totalPages}</span>
                <button className='arrow-pagination'
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </button>
            </div>
        </>
    );
};
