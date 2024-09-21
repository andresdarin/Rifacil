import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';

export const ListadoProductos = ({ showHeroSection = true }) => {
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
        <div className='card-layout'>
            <h1 className='card-title-vertical'>Productos</h1>
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
            </div>
        </div>
    );

};

export default ListadoProductos;
