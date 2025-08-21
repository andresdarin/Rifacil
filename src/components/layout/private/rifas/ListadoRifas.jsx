import React, { useEffect, useState, useRef } from 'react';
import { Global } from '../../../../helpers/Global';

const ListadoRifas = ({ refresh }) => {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRifas, setTotalRifas] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const rifasPerPage = 18;

    const token = localStorage.getItem('token');

    // Ref para guardar la posición del scroll
    const scrollPos = useRef(0);

    const fetchRifas = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${Global.url}rifa/listarRifas?page=${page}&limit=${rifasPerPage}`,
                {
                    headers: { 'Authorization': token },
                }
            );
            if (!response.ok) throw new Error('Error al obtener la lista de rifas');
            const data = await response.json();

            setRifas(data.rifas);
            setTotalRifas(data.totalRifas);
            setTotalPages(data.totalPages);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRifas(currentPage);
    }, [currentPage, refresh]);

    // Después de que se actualizan las rifas (y currentPage), restauramos scroll
    useEffect(() => {
        // Restaurar scroll solo si hay un valor guardado
        if (scrollPos.current) {
            window.scrollTo(0, scrollPos.current);
            scrollPos.current = 0; // reset para no estar restaurando siempre
        }
    }, [rifas]);

    const filteredRifas = rifas.filter(rifa =>
        rifa.NumeroRifa.toString().includes(searchTerm)
    );

    // Guardamos scroll antes de cambiar de página
    const paginate = (e, pageNumber) => {
        e.preventDefault();
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            scrollPos.current = window.scrollY;  // guardamos la posición actual del scroll
            setCurrentPage(pageNumber);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const maxPageButtons = 5;

    const getPageNumbers = () => {
        let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading) return <p>Cargando rifas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='grid-rifas'>
            <h2>Lista de Rifas</h2>
            <div className="search-bar search-bar_asign">
                <input
                    type="text"
                    placeholder="Buscar por número de rifa"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button className='search-bar__submit-button'>
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>

            <div className="grid-container">
                {filteredRifas.map((rifa) => (
                    <div
                        key={rifa._id}
                        className={`grid-card card-rifa ${rifa.vendedorAsignado ? 'assigned' : ''}`}
                    >
                        <h1 className='nro_rifa img-container'>{rifa.NumeroRifa}</h1>
                        <h1>
                            {rifa.pagoRealizado ? (
                                <i className="fa fa-credit-card-alt currency currency_list" aria-hidden="true"></i>
                            ) : (
                                <i className="fa fa-credit-card-alt currency currency_list" aria-hidden="true"></i>
                            )}
                        </h1>
                        <span>{new Date(rifa.FechaSorteo).toLocaleDateString()}</span>
                        <h4 className="description">
                            {rifa.nombreParticipante || '-'}
                        </h4>
                        <h5 className='vendedor-span'>
                            {rifa.vendedorAsignado ? (
                                <span>
                                    Vendedor: {rifa.vendedorAsignado.nombreCompleto} ({rifa.vendedorAsignado.ci})
                                </span>
                            ) : (
                                <span>No asignado a ningún vendedor</span>
                            )}
                        </h5>
                    </div>
                ))}
            </div>

            <div className="pagination pagination-tienda">
                <button
                    type="button"
                    onClick={(e) => paginate(e, currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination__prev pagination-listar-rifas"
                >
                    Anterior
                </button>

                <div className="page-numbers">
                    {getPageNumbers()[0] > 1 && (
                        <>
                            <button type="button" className='pagination-listar-rifas' onClick={(e) => paginate(e, 1)}>1</button>
                            {getPageNumbers()[0] > 2 && <span>...</span>}
                        </>
                    )}

                    {getPageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            type="button"
                            onClick={(e) => paginate(e, pageNum)}
                            className={currentPage === pageNum ? 'active pagination-listar-rifas' : 'pagination-listar-rifas'}
                        >
                            {pageNum}
                        </button>
                    ))}

                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                        <>
                            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && <span>...</span>}
                            <button type="button" className='pagination-listar-rifas tres-puntos' onClick={(e) => paginate(e, totalPages)}>{totalPages}</button>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={(e) => paginate(e, currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination__next pagination-listar-rifas"
                >
                    Siguiente
                </button>
            </div>

        </div>
    );
};

export default ListadoRifas;
