import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const HistorialVendedor = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedVentaId, setExpandedVentaId] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await fetch(`${Global.url}compra/historialVentasRifas`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setVentas(data.ventas);
                } else {
                    console.error(data.message);
                    setVentas([]);
                }
            } catch (error) {
                console.error("Error al obtener historial de ventas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, []);

    const toggleExpand = (id) => {
        setExpandedVentaId(prevId => prevId === id ? null : id);
    };


    const formatDate = (fecha) => {
        return new Date(fecha)
            .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
            .replace(/\//g, '.');
    };

    return (
        <>
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Historial de Ventas</header>
            </div>

            {loading ? (
                <p>Cargando historial...</p>
            ) : ventas.length === 0 ? (
                <p>No se encontraron ventas de rifas.</p>
            ) : (
                <div className="ventas__listado">
                    {ventas.map((venta) => (
                        <div key={venta._id} className="venta__card" onClick={() => toggleExpand(venta._id)}>
                            <div className="card_sin_expand">
                                <div className="section_card">
                                    <h1>{venta.rifa.nombreParticipante}</h1>
                                    <h3>Participante</h3>
                                </div>
                                <div className="section_card">
                                    <h1>{venta.rifa.NumeroRifa}</h1>
                                    <h3>Número de Rifa</h3>
                                </div>
                                <div className="section_card">
                                    <h1>{venta.rifa.precioRifa}</h1>
                                    <h3>Precio ($)</h3>
                                </div>
                                <div className="section_card">
                                    <h1>{formatDate(venta.fechaCompra)}</h1>
                                    <h3>Fecha</h3>
                                </div>
                            </div>
                            {expandedVentaId === venta._id && (
                                <div className="expanded__details">
                                    <div className="detail__row"><h1>Participante</h1><h2>{venta.rifa.nombreParticipante}</h2></div>
                                    <div className="detail__row"><h1>Número de Rifa</h1><h2>{venta.rifa.NumeroRifa}</h2></div>
                                    <div className="detail__row"><h1>Precio de Rifa</h1><h2>${venta.rifa.precioRifa}</h2></div>
                                    <div className="detail__row"><h1>Comprador</h1><h2>{venta.rifa.user?.nombreUsu}</h2></div>
                                    <div className="detail__row"><h1>Email</h1><h2>{venta.rifa.user?.email}</h2></div>
                                    <div className="detail__row"><h1>Fecha de Compra</h1><h2>{formatDate(venta.fechaCompra)}</h2></div>
                                    <div className="detail__row"><h1>Monto Total ($)</h1><h2>{venta.montoTotal}</h2></div>
                                    <div className="detail__row"><h1>Método de Pago</h1><h2>{venta.metodoPago}</h2></div>
                                </div>

                            )}

                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
