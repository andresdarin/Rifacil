import React, { useEffect, useState, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Global } from '../../../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../../context/CartProvider';

// Registrar elementos necesarios para el gráfico (si se usa)
Chart.register(ArcElement, Tooltip, Legend);

export const Tienda = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const { addItem } = useContext(CartContext);
    const [productos, setProductos] = useState([]);
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermProd, setSearchTermProd] = useState('');
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRifaPage, setCurrentRifaPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [rifasPerPage] = useState(15);
    const [totalRifaPages, setTotalRifaPages] = useState(1);
    const [totalRifas, setTotalRifas] = useState(0);
    const navigate = useNavigate();

    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró un token de autorización.');

            const response = await fetch(`${Global.url}producto/listar-todos-los-productos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) throw new Error('Error al obtener los productos.');

            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.products)) {
                setProductos(data.products);
            } else {
                setError('No se pudieron obtener los productos.');
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
            if (!token) throw new Error('No se encontró un token de autorización.');
            if (!searchTermProd) {
                fetchProductos();
                return;
            }

            const response = await fetch(`${Global.url}producto/filtrarProducto/${searchTermProd}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) throw new Error('Error al buscar productos');

            const data = await response.json();
            if (data.status === 'success') {
                setProductos(data.productos);
            } else {
                setError('No se encontraron productos con ese nombre');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función modificada para buscar rifas por número
    const fetchRifasByNumero = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró un token de autorización.');

            // Si el campo de búsqueda está vacío, cargar todas las rifas
            if (!searchTerm.trim()) {
                fetchRifas(currentRifaPage);
                return;
            }

            // Usar un endpoint que filtra por número de rifa
            const response = await fetch(`${Global.url}rifa/listarRifas?page=1&limit=${rifasPerPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) throw new Error('Error al buscar rifas');

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.rifas)) {
                // Filtrar los resultados en el cliente por el número de rifa
                const filteredRifas = data.rifas.filter(rifa =>
                    rifa.NumeroRifa.toString().includes(searchTerm)
                );

                setRifas(filteredRifas);
                setCurrentRifaPage(1); // Resetear la página de rifas a la 1 al buscar

                // Si hay pocas rifas después del filtrado, podemos ajustar el total de páginas
                setTotalRifaPages(Math.max(1, Math.ceil(filteredRifas.length / rifasPerPage)));
                setTotalRifas(filteredRifas.length);
            } else {
                setRifas([]);
                setTotalRifaPages(1);
                setTotalRifas(0);
                setError('No se encontraron rifas con ese número.');
            }
        } catch (error) {
            console.error("Error al buscar rifas:", error);
            setError("Error al buscar rifas: " + error.message);
            setRifas([]);
            setTotalRifaPages(1);
            setTotalRifas(0);
        } finally {
            setLoading(false);
        }
    };

    // Función modificada para cargar rifas con paginación
    const fetchRifas = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró un token de autorización.');

            const response = await fetch(`${Global.url}rifa/listarRifas?page=${page}&limit=${rifasPerPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) throw new Error('Error al obtener las rifas.');

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.rifas)) {
                setRifas(data.rifas);
                setTotalRifas(data.totalRifas);
                setTotalRifaPages(data.totalPages);
                console.log(`Cargadas ${data.rifas.length} rifas. Total: ${data.totalRifas}, Páginas: ${data.totalPages}`);
            } else {
                setError('No se pudieron obtener las rifas.');
                setRifas([]);
                setTotalRifaPages(1);
                setTotalRifas(0);
            }
        } catch (error) {
            setError(error.message);
            setRifas([]);
            setTotalRifaPages(1);
            setTotalRifas(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchRifas(currentRifaPage);
    }, [currentRifaPage]);

    const handleAddToCart = (producto) => {
        console.log("Producto agregado al carrito:", producto);
        addItem(producto);
    };

    const handleAddToCartRifa = (rifa) => {
        addItem({
            ...rifa,
            precio: rifa.precioRifa,                 // normalizo el precio
            nombreProducto: `Rifa #${rifa.NumeroRifa}` // opcional: ajusto el nombre
        });
    };

    const CHAR_LIMIT = 250;
    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const goToCart = () => {
        navigate('/tienda/carrito');
    };

    // Paginación productos
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(productos.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Cambiar la página de las rifas - ahora recarga los datos del servidor
    const paginateRifas = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalRifaPages) {
            setCurrentRifaPage(pageNumber);
        }
    };

    const handlePreviousRifaPage = () => {
        if (currentRifaPage > 1) paginateRifas(currentRifaPage - 1);
    };

    const handleNextRifaPage = () => {
        if (currentRifaPage < totalRifaPages) paginateRifas(currentRifaPage + 1);
    };

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="container-banner__productos">
                <header className="header__productos header_tienda">Tienda</header>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por número de rifa"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchRifasByNumero} className="search-bar__submit-button">
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            {/* Rifas */}
            <div className="card-layout card-tienda-layout card-tienda-layout-rifa">
                <div className="card-list card-tienda-list">
                    {rifas.length > 0 ? (
                        rifas.map((rifa) => (
                            <div key={rifa._id} className="card-tienda-item card-tienda-item-rifa">
                                <div className='items-tienda-rifa'>
                                    <img
                                        src="src/assets/img/foto_rifa.png" // o rifa.imagen si es dinámica
                                        alt="Imagen de la rifa"
                                        className="rifa-imagen"
                                    />
                                    <h1>{rifa.NumeroRifa}</h1>
                                    <h3>${rifa.precioRifa}</h3>
                                </div>
                                <div className="card-buttons card-tienda-buttons card-tienda-buttons-rifa">
                                    <button className="add-to-cart-button" onClick={() => handleAddToCartRifa(rifa)}>
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='emptyMessage'>No hay rifas disponibles.</p>
                    )}
                    <div className="pagination pagination-tienda">
                        <button onClick={handlePreviousRifaPage} disabled={currentRifaPage === 1} className="arrow-pagination">
                            <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                        </button>
                        <span className="page-number">Página {currentRifaPage} de {totalRifaPages}</span>
                        <button onClick={handleNextRifaPage} disabled={currentRifaPage === totalRifaPages} className="arrow-pagination">
                            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Buscador de productos */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar Productos"
                    value={searchTermProd}
                    onChange={(e) => setSearchTermProd(e.target.value)}
                />
                <button onClick={fetchProductosByName} className='search-bar__submit-button'>
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            {/* Productos */}
            <div className="card-layout card-tienda-layout">
                <div className="card-list card-tienda-list card-tienda-list-producto">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((producto) => (
                            <div key={producto._id} className="card-tienda-item">
                                <div>
                                    <img
                                        src={producto.imagen ? `${Global.url}uploads/${producto.imagen}` : '../assets/img/user.png'}
                                        alt={producto.nombreProducto}
                                        className="card-image"
                                    />
                                    <h1>{producto.nombreProducto}</h1>
                                    <h3>${producto.precio}</h3>
                                    <h4>
                                        {expandedDescriptions[producto._id]
                                            ? producto.descripcion
                                            : `${producto.descripcion.substring(0, CHAR_LIMIT)}${producto.descripcion.length > CHAR_LIMIT ? '...' : ''}`}
                                        {producto.descripcion.length > CHAR_LIMIT && (
                                            <button onClick={() => toggleDescription(producto._id)} className="btn-ver-mas">
                                                {expandedDescriptions[producto._id] ? 'Ver menos' : 'Ver más'}
                                            </button>
                                        )}
                                    </h4>
                                </div>
                                <div className="card-buttons card-tienda-buttons">
                                    <button className="add-to-cart-button" onClick={() => handleAddToCart(producto)}>
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='emptyMessage'>No hay productos disponibles.</p>
                    )}
                    <div className="pagination pagination-tienda">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="arrow-pagination">
                            <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
                        </button>
                        <span className="page-number">{currentPage} de {totalPages}</span>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="arrow-pagination">
                            <i className="fa fa-chevron-circle-right" aria-hidden="true"></i>
                        </button>
                    </div>

                    <button
                        onClick={goToCart}
                        className="float-cart-button"
                        aria-label="Ir al carrito"
                    >
                        <i className="fa fa-shopping-cart" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </>
    );
};