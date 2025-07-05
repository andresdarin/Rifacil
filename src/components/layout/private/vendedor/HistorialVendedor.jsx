import React, { useEffect, useRef, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const HistorialVendedor = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [expandedVentaId, setExpandedVentaId] = useState(null);
    const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
    const expandedRef = useRef(null);

    // Simular token del localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${Global.url}compra/historialVentasRifas`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setVentas(data.ventas || []);
                    setEstadisticas(data.vendedor || null);
                } else {
                    console.error(data.message);
                    setError(data.message);
                    setVentas([]);
                }
            } catch (error) {
                console.error("Error al obtener historial de ventas:", error);
                setError("Error de conexión al servidor");
                setVentas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                expandedVentaId &&
                expandedRef.current &&
                !expandedRef.current.contains(event.target)
            ) {
                setExpandedVentaId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [expandedVentaId]);

    const toggleExpand = (id) => {
        setExpandedVentaId(prevId => (prevId === id ? null : id));
    };

    const toggleEstadisticas = () => {
        setMostrarEstadisticas(!mostrarEstadisticas);
    };

    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha)
            .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
            .replace(/\//g, '.');
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="container-banner__productos">
                <header className="header__vendedor header__vendedor-historial">Historial de Ventas</header>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <div className="container-banner__productos">
                    <header className="header__vendedor header__vendedor-historial">Historial de Ventas</header>

                </div>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>{error}</p>
                </div>
            </>

        );
    }

    return (
        <>
            <div className="container-banner__productos">
                <header className="header__vendedor header__vendedor-historial">Historial de Ventas</header>
            </div>

            {/* Panel flotante de estadísticas */}
            {estadisticas && (
                <div className="info-seleccionada panel-asignacion barra_responsive" style={{
                    position: 'fixed',
                    right: mostrarEstadisticas ? '20px' : '-480px',
                    transform: 'translateY(-50%)',
                    transition: 'right 0.3s ease-in-out',
                    zIndex: 1000
                }}>
                    <div className="info-item-flex rifas-container">
                        <div className='info-item '>
                            <h3 className='historial-icono'>🎟️</h3>
                            <h4 className='section_card-oculto'>Total de Ventas</h4>
                            <p>{estadisticas.totalVentas}</p>
                        </div>
                        <div className='info-item'>
                            <h3 className='historial-icono'>💰</h3>
                            <h4 className='section_card-oculto'>Monto Total Vendido</h4>
                            <p>{formatCurrency(estadisticas.montoTotalVendido)}</p>
                        </div>
                    </div>
                    <button
                        className="btn-asignar-rifas btn-asignar-rifas-estadisticas"
                        onClick={toggleEstadisticas}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        📊 {mostrarEstadisticas ? 'Ocultar' : 'Ver'}
                    </button>
                </div>
            )}

            {/* Botón toggle flotante */}
            {estadisticas && (
                <button
                    onClick={toggleEstadisticas}
                    className={`boton-estadisticas ${mostrarEstadisticas ? 'oculto' : ''}`}
                >
                    📊
                </button>
            )}

            {ventas.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>No se encontraron ventas de rifas.</p>
                </div>
            ) : (
                <div className="ventas__listado">
                    {ventas.map((venta) => (
                        <div
                            key={venta._id}
                            className="venta__card venta__card-historial"
                            onClick={() => toggleExpand(venta._id)}
                            ref={expandedVentaId === venta._id ? expandedRef : null}
                        >
                            {expandedVentaId !== venta._id && (
                                <div className="card_sin_expand">
                                    <div className="section_card section_card-oculto">
                                        <h1>{venta.rifa?.nombreParticipante || 'N/A'}</h1>
                                        <h3>Participante</h3>
                                    </div>
                                    <div className="section_card">
                                        <h1>{venta.rifa?.NumeroRifa || 'N/A'}</h1>
                                        <h3>Número de Rifa</h3>
                                    </div>
                                    <div className="section_card section_card-oculto">
                                        <h1>{formatCurrency(venta.rifa?.precioRifa)}</h1>
                                        <h3>Precio</h3>
                                    </div>
                                    <div className="section_card">
                                        <h1>{formatDate(venta.fechaCompra)}</h1>
                                        <h3>Fecha</h3>
                                    </div>
                                </div>
                            )}

                            {expandedVentaId === venta._id && (
                                <div className="expanded__details expanded__details-historial">
                                    <div className="detail__row">
                                        <h1>Fecha de Compra</h1>
                                        <h2>{formatDate(venta.fechaCompra)}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Participante</h1>
                                        <h2>{venta.rifa?.nombreParticipante || 'N/A'}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Número de Rifa</h1>
                                        <h2>{venta.rifa?.NumeroRifa || 'N/A'}</h2>
                                    </div>

                                    <div className="detail__row">
                                        <h1>Email</h1>
                                        <h2>{venta.comprador?.email || 'N/A'}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Comprador</h1>
                                        <h2>{venta.comprador?.nombreUsu || venta.comprador?.name || 'N/A'}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Método de Pago</h1>
                                        <h2>{venta.metodoPago || venta.pago?.metodoPago || 'N/A'}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Estado del Pago</h1>
                                        <h2>{venta.pago?.estadoPago || 'N/A'}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Precio de Rifa</h1>
                                        <h2>{formatCurrency(venta.rifa?.precioRifa)}</h2>
                                    </div>
                                    <div className="detail__row">
                                        <h1>Monto Total</h1>
                                        <h2>{formatCurrency(venta.montoTotal)}</h2>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default HistorialVendedor;