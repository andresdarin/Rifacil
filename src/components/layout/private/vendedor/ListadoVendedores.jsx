import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const ListadoVendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
                throw new Error(`No quedan más vendedores que mostrar`);
            }

            const data = await response.json();
            console.log(data); // Verificar la respuesta del backend

            if (data.status === 'success' && Array.isArray(data.users)) {
                // Ordenar vendedores (activos primero, luego inactivos)
                const sortedVendedores = data.users.sort((a, b) => {
                    if (a.estado === 'activo' && b.estado === 'inactivo') return -1;
                    if (a.estado === 'inactivo' && b.estado === 'activo') return 1;
                    return 0;
                });
                setVendedores(sortedVendedores);
                setPage(data.page);  // Página actual
                setTotalPages(data.pages);  // Total de páginas
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

    const reloadUsuarios = () => {
        setLoading(true);
        fetchVendedores(page);
    };

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${Global.url}usuario/remove/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    reloadUsuarios();
                } else {
                    const result = await response.json();
                    alert(result.message || "Error al eliminar el usuario");
                }
            } catch (error) {
                alert("Error en el servidor: " + error.message);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        const confirmChange = window.confirm("¿Deseas cambiar el estado de este usuario?");
        if (confirmChange) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${Global.url}usuario/change-status/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    reloadUsuarios(); // Actualizar la lista
                } else {
                    alert(result.message || "Error al cambiar el estado del usuario");
                }
            } catch (error) {
                alert("Error en el servidor: " + error.message);
            }
        }
    };

    // Función para cambiar de página
    const handlePageChange = (newPage) => {
        console.log('Cambiando a la página:', newPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) return <div className='center'>Cargando vendedores...</div>;
    if (error) return (
        <div className='error_vendedor'>
            <p>{error}</p>
            <button onClick={() => handlePageChange(1)}>Ir a página 1</button>
        </div>
    );

    return (
        <>
            <div className='card-layout__vendedores'>
                <h1 className='card-title-vertical'>Vendedores</h1>
                <div className="card-container">
                    {vendedores.length > 0 ? (
                        vendedores.map((vendedor) => (
                            <div key={vendedor._id} className={`card card-vendedores ${vendedor.estado === 'inactivo' ? 'opaco' : ''}`}>
                                <div>
                                    <h1>{vendedor.nombreCompleto}</h1>
                                    <h4>{vendedor.email}</h4>
                                    <h5 className={`estado-usuario ${vendedor.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                                        {vendedor.estado}
                                    </h5>
                                </div>

                                <div className="card-buttons card-buttons-prof">
                                    <button
                                        className="status-button"
                                        onClick={() => handleToggleStatus(vendedor._id)}
                                        title="Cambiar estado"
                                    >
                                        <i className="fa-solid fa-user-secret" aria-hidden="true"></i>
                                    </button>

                                    <button
                                        className="delete-button delete-button_vendedores"
                                        onClick={() => handleDeleteUser(vendedor._id)}
                                        title="Eliminar vendedor"
                                    >
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
                <button
                    className="arrow-pagination"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1} // Desactiva el botón si estamos en la primera página
                >
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                </button>
                <span>{page} de {totalPages}</span>
                <button
                    className="arrow-pagination"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages} // Desactiva el botón si estamos en la última página
                >
                    <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                </button>
            </div>
        </>
    );
};
