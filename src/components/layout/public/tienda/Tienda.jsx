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
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRifaPage, setCurrentRifaPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [rifasPerPage] = useState(15);
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
            if (!searchTerm) {
                fetchProductos();
                return;
            }

            const response = await fetch(`${Global.url}producto/filtrarProducto/${searchTerm}`, {
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

    const fetchRifas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${Global.url}rifa/listarRifas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });

            if (!response.ok) throw new Error('Error al obtener las rifas.');

            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.rifas)) {
                setRifas(data.rifas);
            } else {
                setError('No se pudieron obtener las rifas.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
        fetchRifas();
    }, []);

    const handleAddToCart = (producto) => {
        console.log("Producto agregado al carrito:", producto);
        addItem(producto);
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

    // Paginación rifas
    const indexOfLastRifa = currentRifaPage * rifasPerPage;
    const indexOfFirstRifa = indexOfLastRifa - rifasPerPage;
    const currentRifas = rifas.slice(indexOfFirstRifa, indexOfLastRifa);
    const totalRifaPages = Math.ceil(rifas.length / rifasPerPage);
    const paginateRifas = (pageNumber) => setCurrentRifaPage(pageNumber);
    const handlePreviousRifaPage = () => {
        if (currentRifaPage > 1) setCurrentRifaPage(currentRifaPage - 1);
    };
    const handleNextRifaPage = () => {
        if (currentRifaPage < totalRifaPages) setCurrentRifaPage(currentRifaPage + 1);
    };

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="container-banner__productos">
                <header className="header__productos">Tienda</header>
            </div>

            {/* Rifas */}
            <div className="card-layout card-tienda-layout">
                <div className="card-list card-tienda-list">
                    {currentRifas.length > 0 ? (
                        currentRifas.map((rifa) => (
                            <div key={rifa._id} className="card-tienda-item">
                                <div>
                                    <h1>{rifa.NumeroRifa}</h1>
                                    <h3>Precio: ${rifa.precioRifa}</h3>
                                </div>
                                <div className="card-buttons card-tienda-buttons">
                                    <button className="add-to-cart-button" onClick={() => handleAddToCart(rifa)}>
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='emptyMessage'>No hay rifas disponibles.</p>
                    )}
                    <div className="pagination">
                        <button onClick={handlePreviousRifaPage} disabled={currentRifaPage === 1} className="page-button">
                            Anterior
                        </button>
                        <span className="page-number">Página {currentRifaPage} de {totalRifaPages}</span>
                        <button onClick={handleNextRifaPage} disabled={currentRifaPage === totalRifaPages} className="page-button">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Buscador */}
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

            {/* Productos */}
            <div className="card-layout card-tienda-layout">
                <div className="card-list card-tienda-list">
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
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-button">
                            Anterior
                        </button>
                        <span className="page-number">Página {currentPage} de {totalPages}</span>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-button">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
