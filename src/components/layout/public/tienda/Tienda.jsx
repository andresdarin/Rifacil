import React, { useEffect, useState, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Global } from '../../../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../../context/CartProvider';
import fotoRifa from '../../../../assets/img/foto_rifa.png';

// Registrar elementos necesarios para el gráfico (si se usa)
Chart.register(ArcElement, Tooltip, Legend);

export const Tienda = () => {
    // Extraemos addItem y cartItems una sola vez
    const { addItem, cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    // ------------------ Rifas ------------------
    const [allRifas, setAllRifas] = useState([]);
    const [filteredRifas, setFilteredRifas] = useState([]);
    const [currentRifaPage, setCurrentRifaPage] = useState(1);
    const rifasPerPage = 15;
    const [searchTerm, setSearchTerm] = useState('');

    // Carga inicial de todas las rifas
    useEffect(() => {
        const fetchAllRifas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Sin token de autorización.');

                const res1 = await fetch(`${Global.url}rifa/listarRifas?page=1&limit=${rifasPerPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                });
                const data1 = await res1.json();
                const totalRifas = data1.totalRifas;

                const res2 = await fetch(`${Global.url}rifa/listarRifas?page=1&limit=${totalRifas}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                });
                const todasLasRifas = await res2.json();

                const rifasConPagoFalse = todasLasRifas.rifas.filter(rifa => rifa.pagoRealizado === false);
                setAllRifas(rifasConPagoFalse);
                setFilteredRifas(rifasConPagoFalse);

            } catch (err) {
                console.error(err);
            }
        };
        fetchAllRifas();
    }, []);

    // Live-search + debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!searchTerm.trim()) {
                setFilteredRifas(allRifas);
                setCurrentRifaPage(1);
            } else {
                const filtro = allRifas.filter(r => r.NumeroRifa.toString().includes(searchTerm));
                setFilteredRifas(filtro);
                setCurrentRifaPage(1);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, allRifas]);

    // Paginación rifas
    const indexLastRifa = currentRifaPage * rifasPerPage;
    const indexFirstRifa = indexLastRifa - rifasPerPage;
    const currentRifas = filteredRifas.slice(indexFirstRifa, indexLastRifa);
    const totalRifaPages = Math.max(1, Math.ceil(filteredRifas.length / rifasPerPage));

    const paginateRifas = page => {
        if (page >= 1 && page <= totalRifaPages) setCurrentRifaPage(page);
    };
    const handlePrevRifa = () => paginateRifas(currentRifaPage - 1);
    const handleNextRifa = () => paginateRifas(currentRifaPage + 1);
    const handleAddToCartRifa = (rifa) => {
        const yaEnCarrito = cartItems.some(item => item._id === rifa._id); // o item.id

        if (yaEnCarrito) {
            // opcional: mostrar un mensaje, toast, etc.
            console.log("La rifa ya está en el carrito.");
            return;
        }

        addItem({
            ...rifa,
            precio: rifa.precioRifa,
            nombreProducto: `Rifa #${rifa.NumeroRifa}`
        });
    };

    // ------------------ Productos ------------------
    const [productos, setProductos] = useState([]);
    const [searchTermProd, setSearchTermProd] = useState('');
    const [expanded, setExpanded] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    // Función para cargar productos por página
    const fetchProductos = async (page = 1) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${Global.url}producto/listProductos/${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            const data = await res.json();
            if (data.status === 'success') {
                setProductos(data.products);
                setTotalPages(data.pages); // Usar pages del backend
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Cargar productos iniciales
    useEffect(() => {
        if (!isSearching) {
            fetchProductos(currentPage);
        }
    }, [currentPage, isSearching]);

    // Función para buscar productos por nombre
    const fetchProductosByName = async () => {
        if (!searchTermProd.trim()) {
            // Si no hay término de búsqueda, volver a la paginación normal
            setIsSearching(false);
            setCurrentPage(1);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${Global.url}producto/filtrarProducto/${searchTermProd}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setProductos(data.productos);
                setIsSearching(true);
                setCurrentPage(1);
                // Calcular páginas para resultados de búsqueda (paginación del lado del cliente)
                setTotalPages(Math.ceil(data.productos.length / 10)); // Asumiendo 10 por página
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Limpiar búsqueda cuando se borra el input
    useEffect(() => {
        if (!searchTermProd.trim() && isSearching) {
            setIsSearching(false);
            setCurrentPage(1);
        }
    }, [searchTermProd, isSearching]);

    // Para los productos mostrados, si estamos buscando hacemos paginación del lado del cliente
    const currentProducts = isSearching
        ? productos.slice((currentPage - 1) * 10, currentPage * 10)
        : productos;

    const toggleDesc = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const paginateProd = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddToCart = prod => addItem(prod);
    const goToCart = () => navigate('/tienda/carrito');

    const cartCount = cartItems.length;

    return (
        <>
            <div className="container-banner__productos">
                <header className="header__productos header_tienda">Tienda</header>
            </div>
            {/* Live-search rifas */}
            <div className="search-bar">
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Buscar por número de rifa"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="button" className="search-bar__submit-button">
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            {/* Rifas */}
            <div className="card-layout card-tienda-layout card-tienda-layout-rifa">
                <div className="card-list card-tienda-list card-tienda-list-rifa">
                    {currentRifas.length > 0 ? (
                        currentRifas.map(rifa => (
                            <div key={rifa._id} className="card-tienda-item card-tienda-item-rifa">
                                <div className="items-tienda-rifa">
                                    <img
                                        src={fotoRifa}
                                        alt="Imagen de la rifa"
                                        className="rifa-imagen"
                                    />
                                    <h1 className="rifa-numero">{rifa.NumeroRifa}</h1>
                                    <h3 className="rifa-precio">${rifa.precioRifa}</h3>
                                </div>
                                <div className="card-buttons card-tienda-buttons card-tienda-buttons-rifa">
                                    <button
                                        type="button"
                                        className="add-to-cart-button"
                                        onClick={() => handleAddToCartRifa(rifa)}
                                    >
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="emptyMessage">No hay rifas disponibles.</p>
                    )}

                    <div className="pagination pagination-tienda">
                        <button
                            type="button"
                            onClick={handlePrevRifa}
                            disabled={currentRifaPage === 1}
                            className="arrow-pagination"
                        >
                            <i className="fa fa-chevron-circle-left" aria-hidden="true" />
                        </button>
                        <span className="page-number">Página {currentRifaPage} de {totalRifaPages}</span>
                        <button
                            type="button"
                            onClick={handleNextRifa}
                            disabled={currentRifaPage === totalRifaPages}
                            className="arrow-pagination"
                        >
                            <i className="fa fa-chevron-circle-right" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Buscador de productos */}
            <div className="search-bar">
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Buscar Productos"
                    value={searchTermProd}
                    onChange={e => setSearchTermProd(e.target.value)}
                />
                <button
                    type="button"
                    className="search-bar__submit-button"
                    onClick={fetchProductosByName}
                >
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            {/* Productos */}
            <div className="card-layout card-tienda-layout">
                <div className="card-list card-tienda-list card-tienda-list-producto">
                    {currentProducts.length > 0 ? (
                        currentProducts.map(producto => (
                            <div key={producto._id} className="card-tienda-item">
                                <img
                                    src={
                                        producto.imagen
                                            ? `${Global.url}uploads/${producto.imagen}`
                                            : '../assets/img/user.png'
                                    }
                                    alt={producto.nombreProducto}
                                    className="card-image"
                                />
                                <h1 className="producto-nombre">{producto.nombreProducto}</h1>
                                <h3 className="producto-precio">${producto.precio}</h3>
                                <h4 className="producto-descripcion">
                                    {expanded[producto._id]
                                        ? producto.descripcion
                                        : `${producto.descripcion.substring(0, 250)}${producto.descripcion.length > 250 ? '...' : ''}`}
                                    {producto.descripcion.length > 250 && (
                                        <button
                                            type="button"
                                            className="btn-ver-mas"
                                            onClick={() => toggleDesc(producto._id)}
                                        >
                                            {expanded[producto._id] ? 'Ver menos' : 'Ver más'}
                                        </button>
                                    )}
                                </h4>
                                <div className="card-buttons card-tienda-buttons">
                                    <button
                                        type="button"
                                        className="add-to-cart-button"
                                        onClick={() => handleAddToCart(producto)}
                                    >
                                        <i className="fa fa-cart-plus" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="emptyMessage">No hay productos disponibles.</p>
                    )}

                    <div className="pagination pagination-tienda">
                        <button
                            type="button"
                            onClick={() => paginateProd(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="arrow-pagination"
                        >
                            <i className="fa fa-chevron-circle-left" aria-hidden="true" />
                        </button>
                        <span className="page-number">{currentPage} de {totalPages}</span>
                        <button
                            type="button"
                            onClick={() => paginateProd(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="arrow-pagination"
                        >
                            <i className="fa fa-chevron-circle-right" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                className="float-cart-button"
                onClick={goToCart}
                aria-label="Ir al carrito"
            >
                <i className="fa fa-shopping-cart" aria-hidden="true" />
                {cartCount > 0 && (
                    <span className="cart-badge">
                        {cartCount}
                    </span>
                )}
            </button>

        </>
    );
};