import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';

export const ListadoProductos = ({ showHeroSection = true }) => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackGorundVendedor.png')";
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
    }, [page]); // Agregar page como dependencia

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {showHeroSection && ( // Condicional para renderizar el Hero Section
                <div className="container-banner__vendedor">
                    <header className='header__vendedor'>Productos</header>
                </div>
            )}
            <h1>Productos</h1>
            <ul>
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        <li key={producto._id}>
                            {producto.nombreProducto}  ${producto.precio}
                        </li>
                    ))
                ) : (
                    <li>No se encontraron productos</li>
                )}
            </ul>
        </div>
    );
};

export default ListadoProductos;
