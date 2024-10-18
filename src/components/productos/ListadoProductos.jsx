import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import AltaProducto from '../../components/productos/AltaProducto.jsx';
import EditarProducto from './EditarProducto.jsx';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Registra los componentes que vas a usar
Chart.register(ArcElement, Tooltip, Legend);

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
    const [pages, setPages] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
                setPages(data.pages);
            } else {
                setError('No se pudieron obtener los productos');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductosByName = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró un token de autorización.');
            }

            if (!searchTerm) {
                fetchProductos(page);
                return;
            }

            const response = await fetch(`${Global.url}producto/filtrarProducto/${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) {
                throw new Error('Error al buscar productos');
            }

            const data = await response.json();

            if (data.status === 'success') {
                setProductos(data.productos);
                setPages(1); // Si es una búsqueda, asumir que solo tenemos una página de resultados
            } else {
                setError('No se encontraron productos con ese nombre');
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

    const handleEditToggle = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
        }
    };

    // Data para el gráfico de Doughnut
    const data = {
        labels: productos.map(producto => producto.nombreProducto), // Nombres de los productos
        datasets: [
            {
                label: 'Precio de Productos',
                data: productos.map(producto => producto.precio), // Precios de los productos
                backgroundColor: [
                    'rgba(255, 99, 132, 0.75)',
                    'rgba(54, 162, 235, 0.75)',
                    'rgba(255, 206, 86, 0.75)',
                    'rgba(75, 192, 192, 0.75)',
                    'rgba(153, 102, 255, 0.75)',
                    'rgba(255, 159, 64, 0.75)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            {showHeroSection && (
                <div className="container-banner__productos">
                    <header className="header__productos">Productos</header>
                </div>
            )}
            {/* Campo de búsqueda */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchProductosByName} className='search-bar__submit-button'>
                    <i class="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            <div className="card-layout">
                <div className="card-content">
                    <div className="card-list">
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <div key={producto._id} className="card">
                                    <div>
                                        <h1>{producto.nombreProducto}</h1>
                                        <h4>${producto.precio}</h4>
                                        <h4>{producto.descripcion}</h4>
                                        {expandedId === producto._id && (
                                            <div className="edit-form-container">
                                                <EditarProducto
                                                    producto={producto}
                                                    showHeroSection={false}
                                                    showFormSection={true}
                                                    reloadProductos={reloadProductos}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-buttons">
                                        <button className="edit-button" onClick={() => handleEditToggle(producto._id)}>
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
                    </div>

                    {/* Gráfico de Doughnut */}
                    <div className="chart-container">
                        <h2>Distribución de Precios de Productos</h2>
                        <Doughnut data={data} />
                    </div>
                </div>
                {/* Paginado */}
                <div className="pagination">
                    <button
                        className="arrow-pagination"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                    </button>
                    <span>{page} de {pages}</span>
                    <button
                        className="arrow-pagination"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pages}
                    >
                        <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                    </button>
                </div>

                <AltaProducto showHeroSection={false} showFormSection={showFormSection} reloadProductos={reloadProductos} />
            </div>
        </>
    );

};

export default ListadoProductos;
