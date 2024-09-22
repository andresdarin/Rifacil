import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import AltaProducto from '../../components/productos/AltaProducto.jsx';

export const ListadoProductos = ({ showHeroSection = true, showFormSection = true }) => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1); // Cambiado a 'pages'

    const fetchProductos = async (page) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró un token de autorización.');
            }

            const response = await fetch(`${Global.url}producto/listProductos/${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching productos');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.products)) {
                setProductos(data.products);
                setPages(data.pages); // Cambiado a 'pages'
            } else {
                setError('No se pudieron obtener los productos');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos(page);
    }, [page]);

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    const reloadProductos = () => {
        setLoading(true);
        fetchProductos(page);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${Global.url}producto/eliminarProducto/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    reloadProductos();
                    alert("Producto eliminado correctamente");
                } else {
                    const result = await response.json();
                    alert(result.message || "Error al eliminar el producto");
                }
            } catch (error) {
                alert("Error en el servidor: " + error.message);
            }
        }
    };

    // Función para manejar el cambio de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
        }
    };

    return (
        <>
            {showHeroSection && (
                <div className="container-banner__productos">
                    <header className="header__productos">Productos</header>
                </div>
            )}

            <div className='card-layout'>
                <h1 className='card-title-vertical'>Listado</h1>
                <div className="card-container">
                    {productos.length > 0 ? (
                        productos.map((producto) => (
                            <div key={producto._id} className="card">
                                <div>
                                    <h1>{producto.nombreProducto}</h1>
                                    <h4>${producto.precio}</h4>
                                </div>

                                <div className="card-buttons">
                                    <button className="edit-button" onClick={() => handleEdit(producto._id)}>
                                        <i className="fa fa-pencil" aria-hidden="true" />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(producto._id)}>
                                        <i className="fa fa-trash" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron productos</p>
                    )}

                    {/* Paginado */}
                    <div className="pagination">
                        <button
                            className='arrow-pagination'
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                        </button>
                        <span>{page} de {pages}</span>
                        <button
                            className='arrow-pagination'
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pages}
                        >
                            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>

                <AltaProducto showHeroSection={false} showFormSection={showFormSection} reloadProductos={reloadProductos} />
            </div>
        </>
    );
};

export default ListadoProductos;
