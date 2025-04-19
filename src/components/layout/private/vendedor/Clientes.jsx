import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Clientes = ({ vendedorId }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await fetch(Global.url + `rifa/clientes`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setClientes(data.clientes);
                }
            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [vendedorId]);

    if (loading) return <p>Cargando clientes...</p>;

    return (
        <div className="clientes-container">
            <h1>Clientes</h1>
            {clientes.length === 0 ? (
                <p className="sin-clientes">No hay clientes disponibles.</p>
            ) : (
                <ul className="clientes-lista">
                    {clientes.map((cliente, index) => (
                        <li className="cliente-item" key={index}>
                            <strong>{cliente.nombre}</strong><br />
                            <span>Rifas Adquiridas: <h2>{cliente.numerosRifas.join(' | ')}</h2></span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

};
