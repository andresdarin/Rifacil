import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global'; // Asegúrate de que la ruta sea correcta

export const Asignar = () => {
    const [rifas, setRifas] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [rifaSeleccionada, setRifaSeleccionada] = useState("");
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState("");
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const fetchRifasYVendedores = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('No se encontró el token de autenticación.');
                    return;
                }

                // Obtener rifas
                const responseRifas = await fetch(`${Global.url}rifa/listarRifas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                if (responseRifas.ok) {
                    const dataRifas = await responseRifas.json();
                    console.log(dataRifas)
                    if (dataRifas.status === 'success') {
                        setRifas(dataRifas.rifas);
                    } else {
                        alert(dataRifas.message || 'Error al cargar las rifas');
                    }
                } else {
                    console.error('Error al cargar las rifas');
                }

                // Obtener vendedores
                const responseVendedores = await fetch(`${Global.url}usuario/list`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                });

                if (responseVendedores.ok) {
                    const dataVendedores = await responseVendedores.json();
                    if (dataVendedores.status === 'success') {
                        setVendedores(dataVendedores.users);
                    } else {
                        alert(dataVendedores.message || 'Error al cargar los vendedores');
                    }
                } else {
                    console.error('Error al cargar los vendedores');
                }
            } catch (error) {
                console.error('Error al obtener rifas o vendedores:', error);
                alert('Hubo un problema al cargar los datos. Intenta más tarde.');
            }
        };

        fetchRifasYVendedores();
    }, []);

    const handleAsignar = async () => {
        if (!rifaSeleccionada || !vendedorSeleccionado || cantidad <= 0) {
            alert('Por favor, selecciona una rifa, un vendedor y una cantidad válida.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No se encontró el token de autenticación.');
                return;
            }

            const response = await fetch(`${Global.url}asignarRifa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    rifaId: rifaSeleccionada,
                    vendedorId: vendedorSeleccionado,
                    cantidad,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Rifas asignadas correctamente.');
                setCantidad(0);
                setRifaSeleccionada("");
                setVendedorSeleccionado("");
            } else {
                alert(result.message || 'Error al asignar las rifas');
            }
        } catch (error) {
            console.error('Error al asignar rifas:', error);
            alert('Hubo un error al asignar las rifas. Intenta más tarde.');
        }
    };

    return (
        <div className="asignar_container">
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Asignar</header>
            </div>
            <h1>Asignar Rifas a Vendedores</h1>

            <div className="listados">
                <div>
                    <label>Selecciona una Rifa:</label>
                    <select
                        value={rifaSeleccionada}
                        onChange={(e) => setRifaSeleccionada(e.target.value)}
                    >
                        <option value="">Selecciona una rifa</option>
                        {rifas.map((rifa) => (
                            <option key={rifa._id} value={rifa._id}>
                                {rifa.NumeroRifa}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Selecciona un Vendedor:</label>
                    <select
                        value={vendedorSeleccionado}
                        onChange={(e) => setVendedorSeleccionado(e.target.value)}
                    >
                        <option value="">Selecciona un vendedor</option>
                        {vendedores.map((vendedor) => (
                            <option key={vendedor._id} value={vendedor._id}>
                                {vendedor.nombreCompleto}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="formulario-asignar">
                <label>
                    Cantidad de Rifas:
                    <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        min="1"
                    />
                </label>
                <button onClick={handleAsignar}>Asignar Rifas</button>
            </div>

            <div>
                <p>Rifa seleccionada: {rifaSeleccionada || 'Ninguna'}</p>
                <p>Vendedor seleccionado: {vendedorSeleccionado || 'Ninguno'}</p>
            </div>
        </div>
    );
};
