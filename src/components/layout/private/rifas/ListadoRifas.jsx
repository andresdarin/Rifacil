import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

const ListadoRifas = ({ refresh }) => {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRifas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(Global.url + 'rifa/listarRifas', {
                    headers: { 'Authorization': token }
                });
                if (!response.ok) throw new Error('Error al obtener la lista de rifas');
                const data = await response.json();
                setRifas(data.rifas);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRifas();
    }, [refresh]); // Re-fetch cuando cambie el prop refresh

    const rifasFiltradas = rifas.filter(rifa =>
        rifa.NumeroRifa.toString().includes(searchTerm)
    );

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
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='search-bar__submit-button'>
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
            </div>
            <div className="grid-container">
                {rifasFiltradas.map((rifa) => (
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
        </div>
    );
};

export default ListadoRifas;
