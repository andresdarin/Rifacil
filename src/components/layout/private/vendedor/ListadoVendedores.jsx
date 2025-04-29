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
                throw new Error(`No quedan más vendedores que mostrar`);
            }

            const data = await response.json();
            console.log(data); // Verificar la respuesta del backend en la consola

            if (data.status === 'success' && Array.isArray(data.users)) {
                setVendedores(data.users);

                // Usa los datos que devuelve el backend
                setPage(data.page);  // Número de página actual
                setTotalPages(data.pages);  // Número total de páginas
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

    // Función para cambiar de página
    const handlePageChange = (newPage) => {
        console.log('Cambiando a la página:', newPage); // Verifica el valor
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
                            <div key={vendedor._id} className="card card-vendedores">
                                <div>
                                    <h1>{vendedor.nombreCompleto}</h1>
                                    <h4>{vendedor.email}</h4>
                                </div>

                                <div className="card-buttons">
                                    <button className="delete-button delete-button_vendedores" onClick={() => handleDeleteUser(vendedor._id)}>
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
