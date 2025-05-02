import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const Premios = () => {
    const [sorteos, setSorteos] = useState([]);
    const [premios, setPremios] = useState([]);
    const [selectedSorteo, setSelectedSorteo] = useState(null);
    const [selectedPremios, setSelectedPremios] = useState([]);
    const [nuevoPremio, setNuevoPremio] = useState({ nombre: '', descripcion: '' });
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

    const handleCrearPremio = async (e) => {
        e.preventDefault();
        if (!nuevoPremio.nombre || !nuevoPremio.descripcion) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await fetch(Global.url + 'premio/crearPremio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(nuevoPremio)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Premio creado exitosamente.');
                setPremios([...premios, data.premio]); // Actualiza la lista de premios
                setNuevoPremio({ nombre: '', descripcion: '' }); // Limpia el formulario
            } else {
                console.error('Error al crear el premio:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Hubo un problema al crear el premio.');
        }
    };

    const handleToggleDescription = (premioId) => {
        setPremios((prevPremios) =>
            prevPremios.map((premio) =>
                premio._id === premioId
                    ? { ...premio, showFullDescription: !premio.showFullDescription }
                    : premio
            )
        );
    };


    return (
        <div className="premios-container">
            <div className="container-banner__vendedor container-banner_premios">
                <header className="header__vendedor header_premios">Premios</header>
            </div>

            <div className="grid-container_premios">
                <div className="sorteos-lista">
                    <h2 className='sorteos-header'>Sorteos Futuros</h2>
                    {/* Dropdown visible solo en móviles */}
                    <select
                        className="sorteos-dropdown responsive-only"
                        value={selectedSorteo || ''}
                        onChange={(e) => handleSorteoToggle(e.target.value)}
                    >
                        <option value="" disabled>Selecciona un sorteo</option>
                        {sorteos.map((sorteo) => (
                            <option key={sorteo.id} value={sorteo.id}>
                                {new Date(sorteo.fechaSorteo).toLocaleDateString('es-ES')} -
                                {sorteo.premios.length > 0
                                    ? sorteo.premios.map((p) => p.nombre).join(', ')
                                    : 'Sin premios'}
                            </option>
                        ))}
                    </select>
                    {sorteos.length > 0 ? (
                        sorteos.map((sorteo) => (
                            <div
                                key={sorteo.id}
                                className={`sorteo-item ${selectedSorteo === sorteo.id ? 'selected' : ''}`}
                                onClick={() => handleSorteoToggle(sorteo.id)}
                            >
                                <h>{new Date(sorteo.fechaSorteo).toLocaleDateString('es-ES')}</h>
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
                                className={`premio-item ${selectedPremios.includes(premio._id) ? 'selected' : ''}`}
                                onClick={() => handlePremioToggle(premio._id)}
                            >
                                <p>{premio.nombre}</p>
                                {/* Descripción con efecto hover */}
                                <div className="descripcion-hover">
                                    {premio.descripcion}
                                </div>

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

            <div className="crear-premio-container">
                <h3>Crear un nuevo premio</h3>
                <form className='form-group form-group_crear-premio' onSubmit={handleCrearPremio}>
                    <input
                        type="text"
                        placeholder="Nombre del premio"
                        value={nuevoPremio.nombre}
                        onChange={(e) => setNuevoPremio({ ...nuevoPremio, nombre: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Descripción del premio"
                        value={nuevoPremio.descripcion}
                        onChange={(e) => setNuevoPremio({ ...nuevoPremio, descripcion: e.target.value })}
                        required
                    ></textarea>
                    <button className='crear-premio_button' type="submit">Crear Premio</button>
                </form>
            </div>

            <div className="asignar-premio_button">
                <button onClick={handleAsignarPremio}>Asignar Premios</button>
            </div>
        </div>

    );
};
