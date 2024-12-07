import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global'; // Ajusta la ruta según tu proyecto

export const Asignar = () => {
    const [vendedores, setVendedores] = useState([]);
    const [rifas, setRifas] = useState([]);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);
    const [rifaSeleccionada, setRifaSeleccionada] = useState(null);
    const token = localStorage.getItem('token')

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No se encontró el token de autenticación.');
                return;
            }

            try {
                // Obtener vendedores
                const responseVendedores = await fetch(`${Global.url}usuario/list`, {
                    headers: { Authorization: token },
                });
                const dataVendedores = await responseVendedores.json();
                if (dataVendedores.status === 'success') {
                    setVendedores(dataVendedores.users);
                } else {
                    console.error('Error al cargar los vendedores');
                }

                // Obtener rifas
                const responseRifas = await fetch(Global.url + 'rifa/listarRifas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                const dataRifas = await responseRifas.json();
                console.log('Respuesta de rifas:', dataRifas);

                if (dataRifas.status === 'success') {
                    setRifas(dataRifas.rifas);
                } else {
                    console.error('Error al cargar las rifas', dataRifas.message);
                }

            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        fetchData();
    }, []);

    const asignarRifa = async () => {
        if (!vendedorSeleccionado || !rifaSeleccionada) {
            alert('Por favor, selecciona un vendedor y un número de rifa.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No se encontró el token de autenticación.');
            return;
        }

        try {
            const response = await fetch(`${Global.url}rifa/asignarRifaAVendedor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    ciVendedor: vendedorSeleccionado.ci,
                    numeroRifa: rifaSeleccionada.NumeroRifa,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Rifa asignada con éxito.');
                setRifaSeleccionada(null);
                setVendedorSeleccionado(null);
            } else {
                alert(result.message || 'Error al asignar la rifa.');
            }
        } catch (error) {
            console.error('Error al asignar la rifa:', error);
            alert('Error al asignar la rifa. Intenta más tarde.');
        }
    };

    return (
        <div className="container-asignar">
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Asignar Números</header>
            </div>
            <div className="asignar-rifas-container">
                <aside className="vendedores-list">
                    <h3>Vendedores</h3>
                    <ul>
                        {vendedores.map((vendedor) => (
                            <li
                                key={vendedor._id}
                                className='vendedor-item'
                                onClick={() => setVendedorSeleccionado(vendedor)}
                                style={{
                                    background: vendedorSeleccionado?._id === vendedor._id ? '#ddd' : 'transparent',
                                }}
                            >
                                {vendedor.nombreCompleto} (CI: {vendedor.ci})
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="rifas-list">
                    <h3>Números de Rifa</h3>
                    <ul className="rifa-list">
                        {rifas.map((rifa) => (
                            <li
                                key={rifa._id}
                                className={`rifa-item ${rifaSeleccionada?._id === rifa._id ? 'seleccionado' : ''
                                    }`}
                                onClick={() => setRifaSeleccionada(rifa)}
                            >
                                {rifa.NumeroRifa}
                            </li>
                        ))}
                    </ul>
                </div>




                <div className="asignar-button">
                    <button onClick={asignarRifa} disabled={!vendedorSeleccionado || !rifaSeleccionada}>
                        Asignar Rifa
                    </button>
                </div>
            </div>
        </div>

    );
};
