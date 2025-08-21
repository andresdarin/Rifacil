import React, { useEffect, useState, useCallback } from 'react';
import { Global } from '../../../../helpers/Global';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faArrowsToCircle } from '@fortawesome/free-solid-svg-icons';

export const Asignar = () => {
    const [vendedores, setVendedores] = useState([]);
    const [rifas, setRifas] = useState([]);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
    const [rifasSeleccionadas, setRifasSeleccionadas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRifaTerm, setSearchRifaTerm] = useState('');
    const [filteredVendedores, setFilteredVendedores] = useState([]);
    const [filteredRifas, setFilteredRifas] = useState([]);
    const [vendedoresDDL, setVendedoresDDL] = useState([]);

    const [pageVen, setPageVen] = useState(1);
    const [totalPagesVen, setTotalPagesVen] = useState(1);
    const vendedoresPorPagina = 5;

    const [showMoreRif, setShowMoreRif] = useState(false);
    const [showAllRif, setShowAllRif] = useState(false);
    const rifasPorPagina = 15;

    const [asignando, setAsignando] = useState(false);

    useEffect(() => {
        const fetchVendedores = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${Global.url}usuario/list/${pageVen}`, { headers: { Authorization: token } });
                const data = await res.json();
                if (data.status === 'success') {
                    const activos = data.users.filter(v => (v.estado || '').toLowerCase() === 'activo');
                    if (pageVen === 1) {
                        setVendedores(activos);
                    } else {
                        setVendedores(prev => [...prev, ...activos]);
                    }
                    setTotalPagesVen(data.pages);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchVendedores();
    }, [pageVen]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchTodosVendedoresActivos = async () => {
            try {
                const res = await fetch(`${Global.url}usuario/vendedores/activos`, {
                    headers: { Authorization: token }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setVendedoresDDL(data.vendedores);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTodosVendedoresActivos();
    }, []);

    useEffect(() => {
        setFilteredVendedores(
            searchTerm
                ? vendedores.filter(v =>
                    v.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.ci.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : vendedores
        );
    }, [searchTerm, vendedores]);

    useEffect(() => {
        const fetchRifas = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${Global.url}rifa/listarRifas?page=1&limit=1000`, {
                    headers: { 'Content-Type': 'application/json', Authorization: token },
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setRifas(data.rifas);
                    setFilteredRifas(data.rifas);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchRifas();
    }, []);

    useEffect(() => {
        setFilteredRifas(
            searchRifaTerm
                ? rifas.filter(r => r.NumeroRifa.toString().includes(searchRifaTerm))
                : rifas
        );
    }, [searchRifaTerm, rifas]);

    const toggleRifaSeleccionada = useCallback((rifa) => {
        if (rifa.vendedorAsignado) return;
        setRifasSeleccionadas(prev =>
            prev.some(x => x._id === rifa._id)
                ? prev.filter(x => x._id !== rifa._id)
                : [...prev, rifa]
        );
    }, []);

    const asignarRifas = useCallback(async () => {
        // Prevenir múltiples clics
        if (asignando) {
            return;
        }

        if (!vendedorSeleccionado || rifasSeleccionadas.length === 0) {
            toast.error('Selecciona un vendedor y al menos una rifa.');
            return;
        }

        if (!vendedorSeleccionado.ci) {
            toast.error('El vendedor seleccionado no tiene CI válido');
            return;
        }

        setAsignando(true);

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`${Global.url}rifa/asignarRifaAVendedor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    ci: vendedorSeleccionado.ci,
                    numerosRifas: rifasSeleccionadas.map(r => r.NumeroRifa),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Rifas asignadas correctamente');
                // Resetear selección
                setRifasSeleccionadas([]);
                setVendedorSeleccionado(null);

                // Actualizar rifas para reflejar la asignación
                setRifas(prevRifas =>
                    prevRifas.map(rifa => {
                        const wasAssigned = rifasSeleccionadas.some(r => r._id === rifa._id);
                        return wasAssigned
                            ? { ...rifa, vendedorAsignado: vendedorSeleccionado.ci }
                            : rifa;
                    })
                );
            } else {
                toast.error(data.message || 'Error al asignar rifas');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al asignar rifas');
        } finally {
            setAsignando(false);
        }
    }, [asignando, vendedorSeleccionado, rifasSeleccionadas]);

    const cargarMasVendedores = useCallback(() => {
        if (pageVen < totalPagesVen) {
            setPageVen(prev => prev + 1);
        }
    }, [pageVen, totalPagesVen]);

    const handleToggleRifas = useCallback(() => {
        setShowMoreRif(prev => !prev);
    }, []);

    const handleShowAllRifas = useCallback(() => {
        setShowAllRif(true);
    }, []);

    return (
        <div className="container-asignar">
            <div className="container-banner__productos">
                <header className="header__vendedor header__admin">Asignar Números</header>
            </div>
            <div className="asignar-rifas-container">
                {/* Vendedores */}
                <aside className="vendedores-list">
                    <h3>Vendedores</h3>
                    <select
                        className="vendedores-dropdown"
                        value={vendedorSeleccionado?._id || ''}
                        onChange={(e) => {
                            const selected = vendedoresDDL.find(v => v._id === e.target.value);
                            setVendedorSeleccionado(selected);
                        }}
                    >
                        <option value="">Seleccione un vendedor</option>
                        {vendedoresDDL.map(v => (
                            <option key={v._id} value={v._id}>
                                {v.nombreCompleto} - Nº {v.ci}
                            </option>
                        ))}
                    </select>
                    <div className="search-bar search-bar_asign item-vendedor">
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Buscar Vendedores"
                        />
                        <button className="search-bar__submit-button">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                    </div>
                    <ul className="card item-vendedor">
                        {filteredVendedores.map(v => (
                            <li
                                key={v._id}
                                className={`vendedor-item ${vendedorSeleccionado?._id === v._id ? 'seleccionado' : ''}`}
                                onClick={() => setVendedorSeleccionado(v)}
                            >
                                <h2>{v.nombreCompleto}</h2>
                                <h4>Nº {v.ci}</h4>
                            </li>
                        ))}
                    </ul>
                    <div className="ver-mas item-vendedor">
                        {pageVen < totalPagesVen && (
                            <button onClick={cargarMasVendedores}>Ver más vendedores</button>
                        )}
                    </div>
                </aside>

                {/* Rifas */}
                <div className="rifas-list">
                    <h3>Rifas</h3>
                    <div className="search-bar search-bar_asign">
                        <input
                            value={searchRifaTerm}
                            onChange={e => setSearchRifaTerm(e.target.value)}
                            placeholder="Buscar por número de rifa"
                        />
                        <button className="search-bar__submit-button">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                    </div>
                    <ul className="rifa-list">
                        {(showAllRif
                            ? filteredRifas
                            : showMoreRif
                                ? filteredRifas
                                : filteredRifas.slice(0, rifasPorPagina)).map(r => (
                                    <li
                                        key={r._id}
                                        className={`rifa-item ${r.vendedorAsignado
                                            ? 'deshabilitada'
                                            : rifasSeleccionadas.some(x => x._id === r._id)
                                                ? 'seleccionado'
                                                : ''
                                            }`}
                                        onClick={() => toggleRifaSeleccionada(r)}
                                    >
                                        <span>{r.NumeroRifa}</span>
                                        {r.vendedorAsignado && <span className="vendedor-asignado asignada">Asignada</span>}
                                    </li>
                                ))}
                    </ul>

                    {!showAllRif && filteredRifas.length > rifasPorPagina && (
                        <div className="control-rifas">
                            <button className='btn-asignar' onClick={handleToggleRifas}>
                                <FontAwesomeIcon icon={showMoreRif ? faMinus : faPlus} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Panel de asignación */}
            <div className="info-seleccionada panel-asignacion">
                <div className="info-item-flex">
                    <div className='info-item info-item-rifas'>
                        <h4>Vendedor</h4>
                        <p>{vendedorSeleccionado ? vendedorSeleccionado.nombreCompleto : 'No seleccionado'}</p>
                    </div>
                    <div className='info-item info-item-rifas'>
                        <h4>Rifas seleccionadas</h4>
                        <p>{rifasSeleccionadas.length}</p>
                    </div>
                </div>
                <button
                    className="btn-asignar btn-asignar-rifas"
                    onClick={asignarRifas}
                    disabled={asignando}
                    style={{
                        opacity: asignando ? 0.6 : 1,
                        cursor: asignando ? 'not-allowed' : 'pointer'
                    }}
                >
                    <FontAwesomeIcon icon={faArrowsToCircle} />
                    {asignando ? 'Asignando...' : 'Asignar Rifas'}
                </button>
            </div>
        </div>
    );
};