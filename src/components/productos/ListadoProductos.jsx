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
    const [emptyMessage, setEmptyMessage] = useState('');
    const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Para controlar qué descripciones están expandidas

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

            // Si es 404, mostrar un mensaje personalizado
            if (response.status === 404) {
                setProductos([]); // Asegurarse de limpiar productos
                setEmptyMessage('No hay productos disponibles en esta página.');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al obtener los productos.');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.products)) {
                setProductos(data.products);
                setPages(data.pages);
            } else {
                setError('No se pudieron obtener los productos.');
            }
        } catch (error) {
            setError(error.message || 'Ocurrió un error al obtener los productos.');
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

    // Función para generar un color aleatorio en formato RGB
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.75)`; // Color con transparencia
    };

    // Función para generar un array de colores aleatorios según la cantidad de productos
    const generateRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(getRandomColor());
        }
        return colors;
    };
    const randomBackgroundColors = generateRandomColors(productos.length);
    const randomBorderColors = randomBackgroundColors.map(color => color.replace('0.75', '1'));

    const data = {
        labels: productos.map(producto => producto.nombreProducto),
        datasets: [
            {
                label: 'Vendidos',
                data: productos.map(producto => producto.cantidadVendidos),
                backgroundColor: randomBackgroundColors, // Colores de fondo aleatorios
                borderColor: randomBorderColors, // Colores de borde más sólidos
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom', // Posiciona la leyenda abajo
                align: 'start', // Alinea la leyenda a la izquierda
                labels: {
                    color: '#FFF',
                    boxWidth: 10,
                    padding: 15,
                },
            },
        },
        layout: {
            padding: {
                bottom: 20, // Añade un margen inferior al gráfico
            },
        },
    };


    // Define el límite de caracteres
    const CHAR_LIMIT = 250;

    // Función para alternar la expansión de la descripción
    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id], // Cambia el estado de expansión para este ID
        }));
    };

    const hasVentas = productos.some(producto => producto.cantidadVendidos > 0);


    return (
        <>
            {showHeroSection && (
                <div className="container-banner__productos">
                    <header className="header__productos header__productos-listado">Productos</header>
                </div>
            )}
            {/* Campo de búsqueda */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar Productos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchProductosByName} className='search-bar__submit-button'>
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            <div className="card-layout">
                <h2 className="titulo-responsive card-title-vertical">Productos</h2>
                <div className="card-content">
                    <div className="card-list">
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <div key={producto._id} className="card card-productos">
                                    <div className="img-container-list-prod">
                                        <img
                                            className='img'
                                            src={producto.imagen ? `${Global.url}uploads/${producto.imagen}` : '/images/default-product.png'}
                                            alt={producto.nombreProducto}
                                        />
                                    </div>
                                    <div>
                                        <h1>{producto.nombreProducto}</h1>
                                        <h4>${producto.precio}</h4>
                                        <h4>
                                            {expandedDescriptions[producto._id]
                                                ? producto.descripcion
                                                : `${producto.descripcion.substring(0, CHAR_LIMIT)}${producto.descripcion.length > CHAR_LIMIT ? '...' : ''}`}
                                            {/* Botón "Ver más" */}
                                            {producto.descripcion.length > CHAR_LIMIT && (
                                                <button onClick={() => toggleDescription(producto._id)} className="btn-ver-mas">
                                                    {expandedDescriptions[producto._id] ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            )}
                                        </h4>
                                        <h4 className='coursive'>Llevas vendidos {producto.cantidadVendidos} de este producto.</h4>
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
                                    <div className="card-buttons card-buttons__productos">
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
                            <p className='emptyMessage'>No hay productos disponibles en esta página.</p>
                        )}
                    </div>

                    {/* Gráfico de Doughnut - Manteniendo la estructura */}
                    {hasVentas && (
                        <div className="chart-title-container">
                            <h2 className='emptyMessage'>Estadísticas de venta</h2>
                            <div className="chart-container">
                                <Doughnut data={data} options={options} />
                            </div>
                        </div>
                    )}
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
