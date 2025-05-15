import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export const Asignar = () => {
    const [vendedores, setVendedores] = useState([]);
    const [rifas, setRifas] = useState([]);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
    const [rifasSeleccionadas, setRifasSeleccionadas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRifaTerm, setSearchRifaTerm] = useState('');
    const [filteredVendedores, setFilteredVendedores] = useState([]);
    const [filteredRifas, setFilteredRifas] = useState([]);

    // Paginación vendedores
    const [pageVen, setPageVen] = useState(1);
    const [totalPagesVen, setTotalPagesVen] = useState(1);
    const vendedoresPorPagina = 5;

    // Mostrar más/menos rifas
    const [showMoreRif, setShowMoreRif] = useState(false);
    const [showAllRif, setShowAllRif] = useState(false);
    const rifasPorPagina = 15;

    // Fetch vendedores
    useEffect(() => {
        const fetchVendedores = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${Global.url}usuario/list/${pageVen}`, { headers: { Authorization: token } });
                const data = await res.json();
                if (data.status === 'success') {
                    const activos = data.users.filter(v => (v.estado || '').toLowerCase() === 'activo');
                    // Aquí está el cambio - no concatenamos, sino que reemplazamos con todos los vendedores hasta la página actual
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

    // Actualizar filteredVendedores cuando cambian los vendedores
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

    // Fetch rifas
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

    // Filtrar rifas
    useEffect(() => {
        setFilteredRifas(
            searchRifaTerm
                ? rifas.filter(r => r.NumeroRifa.toString().includes(searchRifaTerm))
                : rifas
        );
    }, [searchRifaTerm, rifas]);

    // Toggle selección de rifa
    const toggleRifaSeleccionada = rifa => {
        // Verificar explícitamente si la rifa tiene vendedor asignado
        if (rifa.vendedorAsignado) {
            // No hacer nada si ya tiene vendedor asignado
            return;
        }

        setRifasSeleccionadas(prev =>
            prev.some(x => x._id === rifa._id)
                ? prev.filter(x => x._id !== rifa._id)
                : [...prev, rifa]
        );
    };

    // Asignar rifas
    const asignarRifas = async () => {
        if (!vendedorSeleccionado || rifasSeleccionadas.length === 0) {
            toast.error('Selecciona un vendedor y al menos una rifa.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${Global.url}rifa/asignarRifaAVendedor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: token },
                body: JSON.stringify({
                    ci: vendedorSeleccionado.ci,
                    numerosRifas: rifasSeleccionadas.map(r => r.NumeroRifa),
                }),
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Rifas asignadas exitosamente');
                // Actualizar las rifas después de la asignación
                const rifasActualizadas = rifas.map(r => {
                    if (rifasSeleccionadas.some(sr => sr._id === r._id)) {
                        return { ...r, vendedorAsignado: vendedorSeleccionado.ci };
                    }
                    return r;
                });
                setRifas(rifasActualizadas);
                setFilteredRifas(rifasActualizadas);
                setRifasSeleccionadas([]);
                setVendedorSeleccionado(null);
                setShowMoreRif(false);
                setShowAllRif(false);
            } else {
                toast.error(result.message || 'Error al asignar rifas');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error al asignar rifas');
        }
    };

    // Cargar más vendedores
    const cargarMasVendedores = () => pageVen < totalPagesVen && setPageVen(prev => prev + 1);

    // Toggle mostrar más/menos
    const handleToggleRifas = () => setShowMoreRif(prev => !prev);
    const handleShowAllRifas = () => setShowAllRif(true);

    return (
        <div className="container-asignar">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container-banner__vendedor">
                <header className="header__vendedor header__admin">Asignar Números</header>
            </div>
            <div className="asignar-rifas-container">
                {/* Vendedores */}
                <aside className="vendedores-list">
                    <h3>Vendedores</h3>
                    <div className="search-bar search-bar_asign">
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
                        {pageVen < totalPagesVen && <button onClick={cargarMasVendedores}>Ver más vendedores</button>}
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
                                        {r.vendedorAsignado && <span className="vendedor-asignado">Asignada</span>}
                                    </li>
                                ))}
                    </ul>

                    {!showAllRif && filteredRifas.length > rifasPorPagina && (
                        <div className="control-rifas">
                            <button className='btn-asignar' onClick={handleToggleRifas}>
                                <FontAwesomeIcon icon={showMoreRif ? faMinus : faPlus} />                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Panel de asignación */}
            <div className="panel-asignacion">
                <div className="info-seleccionada">
                    <div className="info-item-flex">
                        <div className='info-item'>
                            <h4>Vendedor</h4>
                            <p>{vendedorSeleccionado ? vendedorSeleccionado.nombreCompleto : 'No seleccionado'}</p>
                        </div>
                        <div className='info-item'>
                            <h4>Rifas seleccionadas</h4>
                            <p>{rifasSeleccionadas.length} rifas</p>
                        </div>
                    </div>
                    <button
                        className="btn-asignar"
                        onClick={asignarRifas}
                        disabled={!vendedorSeleccionado || rifasSeleccionadas.length === 0}
                    >
                        Asignar Rifas
                    </button>
                </div>
            </div>

        </div>
    );
};