import React, { useEffect, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Global } from '../../../../helpers/Global';
import { useNavigate } from 'react-router-dom';


// Registra los componentes que vas a usar
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

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const navigate = useNavigate();

    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró un token de autorización.');
            }

            const response = await fetch(`${Global.url}producto/listar-todos-los-productos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los productos.');
            }

            const data = await response.json();

            if (data.status === 'success' && Array.isArray(data.products)) {
                setProductos(data.products);
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

            if (!response.ok) {
                throw new Error('Error al buscar productos');
            }

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

    useEffect(() => {
        fetchProductos();
    }, []);

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAddToCart = (producto) => {
        setCart([...cart, producto]);
        alert(`${producto.nombreProducto} ha sido agregado al carrito.`);
    };

    // Define el límite de caracteres
    const CHAR_LIMIT = 250;
    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id], // Cambia el estado de expansión para este ID
        }));
    };

    const goToCart = () => {
        navigate('/tienda/carrito');
    };

    return (
        <>
            <div className="container-banner__productos">
                <header className="header__productos">Tienda</header>
            </div>
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

            <div className="card-layout card-tienda-layout">
                <div className="card-list card-tienda-list">
                    {productos.length > 0 ? (
                        productos.map((producto) => (
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
                                        {/* Botón "Ver más" */}
                                        {producto.descripcion.length > CHAR_LIMIT && (
                                            <button onClick={() => toggleDescription(producto._id)} className="btn-ver-mas">
                                                {expandedDescriptions[producto._id] ? 'Ver menos' : 'Ver más'}
                                            </button>
                                        )}</h4>
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
                    {/* Botón flotante */}
                    <button className="float-cart-button" onClick={goToCart}>
                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Tienda;