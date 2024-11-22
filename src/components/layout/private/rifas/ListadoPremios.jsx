import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

const ListadoPremios = () => {
    const [premios, setPremios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPremios = async () => {
            try {
                const response = await fetch(Global.url + 'premio/listarPremios', {
                    headers: {
                        'Authorization': token
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de premios');
                }
                const data = await response.json();
                setPremios(data.premios);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPremios();
    }, []);

    if (loading) return <p>Cargando premios...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='grid-premios'>
            <h2>Lista de Premios</h2>
            <div className="grid-container">
                {premios.map((premio) => (
                    <div
                        key={premio._id}
                        className="grid-card card-premio"
                    >
                        <h1 className='premio-descripcion img-container'>{premio.descripcion}</h1>
                        <span> {new Date(premio.sorteo.fechaSorteo).toLocaleDateString()}</span>
                        <span>
                            {premio.ganador ? (
                                <i className="fa fa-trophy" style={{ color: 'gold' }} aria-hidden="true"></i>
                            ) : (
                                <i className="fa fa-trophy" style={{ color: 'gray' }} aria-hidden="true"></i>
                            )}
                        </span>
                        <h4 className="ganador">
                            {premio.ganador ? premio.ganador.nombreParticipante : 'Sin ganador'}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListadoPremios;
