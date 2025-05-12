import React, { useEffect, useState } from 'react';
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

    // Función para obtener las rifas desde la API
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

            // Actualizar el estado con los datos recibidos
            setRifas(data.rifas);
            setTotalRifas(data.totalRifas);
            setTotalPages(data.totalPages);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar las rifas cada vez que cambie la página o el parámetro `refresh`
    useEffect(() => {
        fetchRifas(currentPage);
    }, [currentPage, refresh]);

    // Filtrar las rifas en el frontend
    const filteredRifas = rifas.filter(rifa =>
        rifa.NumeroRifa.toString().includes(searchTerm)
    );

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Función para manejar la búsqueda
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reinicia la página a 1 en cada búsqueda

        // Si la búsqueda está activa, no aplicamos paginación en el backend
        // ya que filtramos los resultados en el frontend
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

            {/* Paginación */}
            <div className="pagination pagination-tienda">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination__prev"
                >
                    Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={currentPage === pageNum ? 'active' : ''}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination__next"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ListadoRifas;