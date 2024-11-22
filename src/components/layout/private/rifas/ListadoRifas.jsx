import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

const ListadoRifas = () => {
    const [rifas, setRifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRifas = async () => {
            try {
                const response = await fetch(Global.url + 'rifa/listarRifas', {
                    headers: {
                        'Authorization': token
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de rifas');
                }
                const data = await response.json();
                setRifas(data.rifas);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRifas();
    }, []);

    if (loading) return <p>Cargando rifas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='grid-rifas'>
            <h2>Lista de Rifas</h2>
            <div className="grid-container">
                {rifas.map((rifa) => (
                    <div
                        key={rifa._id}
                        className="grid-card card-rifa"
                    >
                        <h1 className='nro_rifa img-container'> {rifa.NumeroRifa}</h1>
                        <span> {new Date(rifa.FechaSorteo).toLocaleDateString()}</span>
                        <span>
                            <span>
                                {rifa.pagoRealizado ? (
                                    <i className="fa fa-credit-card-alt currency" style={{ color: 'green' }} aria-hidden="true"></i>
                                ) : (
                                    <i className="fa fa-credit-card-alt currency" style={{ color: 'red' }} aria-hidden="true"></i>
                                )}
                            </span>
                            {rifa.pagoRealizado ? ' Pagada' : ' No Pagada'}

                        </span>
                        <h4 className="description">
                            {rifa.nombreParticipante ? rifa.nombreParticipante : '-'}
                        </h4>

                    </div>
                ))}
            </div>
        </div>
    );

};

export default ListadoRifas;
