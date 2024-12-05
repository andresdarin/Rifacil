import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Premios = () => {
    const [sorteos, setSorteos] = useState([]);
    const [premios, setPremios] = useState([]);
    const [selectedSorteo, setSelectedSorteo] = useState(null);
    const [selectedPremios, setSelectedPremios] = useState([]);
    const token = localStorage.getItem('token');

    // Cambiar el fondo de la página
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    // Obtener los sorteos futuros
    useEffect(() => {
        const fetchSorteosFuturos = async () => {
            try {
                const response = await fetch(Global.url + 'sorteo/sorteosFuturos');
                const data = await response.json();
                if (response.ok) {
                    setSorteos(data.sorteos);
                } else {
                    console.error('Error al obtener los sorteos:', data.message);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };
        fetchSorteosFuturos();
    }, []);

    // Obtener los premios disponibles
    useEffect(() => {
        const fetchPremios = async () => {
            try {
                if (!token) {
                    console.error('No se encontró el token de autenticación.');
                    return;
                }

                const response = await fetch(Global.url + 'premio/listarPremios', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setPremios(data.premios);
                } else {
                    console.error('Error al listar los premios:', data.message);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        };

        fetchPremios();
    }, [token]);

    // Manejar la asignación de premios
    const handleAsignarPremio = async () => {
        console.log('Sorteo seleccionado:', selectedSorteo);
        console.log('Premios seleccionados:', selectedPremios);

        if (!selectedSorteo || selectedPremios.length === 0) {
            alert('Selecciona un sorteo y al menos un premio para asignar.');
            return;
        }

        try {
            const response = await fetch(Global.url + 'sorteo/asignarPremio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({
                    idSorteo: selectedSorteo,
                    idPremios: selectedPremios,

                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Premios asignados al sorteo con éxito.');
                setSorteos((prevSorteos) =>
                    prevSorteos.map((sorteo) =>
                        sorteo._id === selectedSorteo
                            ? { ...sorteo, premios: [...sorteo.premios, ...data.premios] }
                            : sorteo
                    )
                );
                setSelectedPremios([]); // Limpia los premios seleccionados
            } else {
                console.error('Error al asignar los premios:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Hubo un problema al asignar los premios.');
        }
    };

    // Manejar el toggle de selección de premios
    const handlePremioToggle = (premioId) => {
        if (selectedPremios.includes(premioId)) {
            setSelectedPremios(selectedPremios.filter((id) => id !== premioId));
        } else {
            setSelectedPremios([...selectedPremios, premioId]);
        }
    };

    // Manejar el toggle de selección de sorteos
    const handleSorteoToggle = (sorteoId) => {
        setSelectedSorteo(sorteoId === selectedSorteo ? null : sorteoId);
    };

    // Efecto para monitorear cambios en selectedSorteo
    useEffect(() => {
        console.log('selectedSorteo actualizado:', selectedSorteo);
    }, [selectedSorteo]);

    console.log('selectedPremios', selectedPremios)

    return (
        <div className="premios-container">
            <div className="container-banner__vendedor">
                <header className="header__vendedor">Premios</header>
            </div>

            <div className="grid-container_premios">
                <div className="sorteos-lista">
                    <h2 className='sorteos-header'>Sorteos Futuros</h2>
                    {sorteos.length > 0 ? (
                        sorteos.map((sorteo) => (
                            <div
                                key={sorteo.id}
                                className={`card sorteo-item ${selectedSorteo === sorteo.id ? 'selected' : ''}`}
                                onClick={() => handleSorteoToggle(sorteo.id)}
                            >
                                <h3>Fecha del sorteo: {new Date(sorteo.fechaSorteo).toLocaleDateString('es-ES')}</h3>
                                <p>
                                    Premios asignados:{' '}
                                    {sorteo.premios.length > 0
                                        ? sorteo.premios.map((premio) => premio.nombre).join(', ')
                                        : 'Ninguno'}
                                </p>
                                <button className="select-button">
                                    {selectedSorteo === sorteo.id ? 'Sorteo seleccionado' : 'Seleccionar'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay sorteos futuros disponibles.</p>
                    )}
                </div>

                <div className="premios-lista">
                    <h2 className="premios-header">Premios Disponibles</h2>
                    {premios.length > 0 ? (
                        premios.map((premio) => (
                            <div
                                key={premio._id}
                                className={`card premio-item ${selectedPremios.includes(premio._id) ? 'selected' : ''}`}
                                onClick={() => handlePremioToggle(premio._id)}
                            >
                                <p>{premio.nombre}</p>
                                <button className="select-button">
                                    {selectedPremios.includes(premio._id) ? 'Premio seleccionado' : 'Seleccionar'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No hay premios disponibles.</p>
                    )}
                </div>
            </div>

            <div className="asignar-premio">
                <button onClick={handleAsignarPremio}>Asignar Premios</button>
            </div>
        </div>

    );
};
