import React, { useEffect, useState } from 'react';
import { Global } from '../../../../../helpers/Global';

export const Clientes = ({ vendedorId }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clienteExpandido, setClienteExpandido] = useState(null); // estado para ver más
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

    const toggleExpand = (index) => {
        setClienteExpandido(prev => (prev === index ? null : index));
    };

    if (loading) return <p>Cargando clientes...</p>;

    return (
        <div className="clientes-container">
            <h1>Clientes</h1>
            {clientes.length === 0 ? (
                <p className="sin-clientes">No hay clientes disponibles.</p>
            ) : (
                <ul className="clientes-lista">
                    {clientes.map((cliente, index) => {
                        const rifasMostradas = clienteExpandido === index
                            ? cliente.numerosRifas
                            : cliente.numerosRifas.slice(0, 3);
                        const hayMas = cliente.numerosRifas.length > 3;

                        return (
                            <li className="cliente-item" key={index}>
                                <strong>{cliente.nombre}</strong><br />
                                <span>Rifas Adquiridas: </span>
                                <div className="numeros-rifas-scroll">
                                    <h2>{rifasMostradas.join(' | ')}</h2>
                                </div>
                                {hayMas && (
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="ver-mas-button ver-mas-perfil-vendedor"
                                    >
                                        {clienteExpandido === index ? '-' : '+'}
                                    </button>
                                )}
                            </li>

                        );
                    })}
                </ul>
            )}
        </div>
    );
};
