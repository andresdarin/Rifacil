import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const VenderRifa = () => {
    const [rifas, setRifas] = useState([]);
    const [selectedRifa, setSelectedRifa] = useState(null);
    const [inputQuery, setInputQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        const userRaw = localStorage.getItem('user');
        const userId = userRaw ? JSON.parse(userRaw).id : null;
        if (userId) obtenerRifasAsignadas(userId);

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const obtenerRifasAsignadas = async (userId) => {
        try {
            const res = await fetch(Global.url + 'rifa/rifas-por-vendedor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setRifas(
                    data.data.numerosRifa.map(({ _id, numero }) => ({
                        NumeroRifa: { _id, numero },
                        nombreParticipante: '',
                        ciParticipante: '',
                        emailParticipante: '',
                        telefonoParticipante: '',
                        metodoPago: '',
                        vendida: false
                    }))
                );
            }
        } catch (error) {
            console.error('Error al obtener rifas:', error);
        }
    };

    const handleSearch = () => setSearchTerm(inputQuery);

    const venderRifa = async (numeroRifa) => {
        const rifa = rifas.find(r => r.NumeroRifa._id === numeroRifa);
        if (!rifa) {
            console.error('Rifa no encontrada en el estado');
            return;
        }

        const { nombreParticipante, ciParticipante, emailParticipante, telefonoParticipante, metodoPago } = rifa;
        if (!nombreParticipante || !ciParticipante || !emailParticipante || !telefonoParticipante || !metodoPago) {
            console.error('Debes completar todos los campos antes de vender.');
            return;
        }

        const bodyData = {
            rifaId: numeroRifa,
            metodoPago,
            numeroCuotas: 1,
            datosClienteFisico: {
                nombre: nombreParticipante,
                correo: emailParticipante,
                cedula: ciParticipante,
                telefono: telefonoParticipante
            }
        };
        console.log('🔔 Body request:', bodyData);

        try {
            const res = await fetch(Global.url + 'compra/realizarCompraFisica', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
                body: JSON.stringify(bodyData)
            });
            const data = await res.json();
            console.log('🔔 Respuesta venta:', data);
            if (res.ok && data.status === 'success') {
                console.log('Compra realizada correctamente');
                setRifas(prev => prev.map(r =>
                    r.NumeroRifa._id === numeroRifa ? { ...r, vendida: true } : r
                ));
                setSelectedRifa(null);
            } else {
                console.error('Error al realizar la compra:', data.message || data);
            }
        } catch (error) {
            console.error('Error de red al realizar la compra:', error);
        }
    };

    // Filtrar rifas según searchTerm
    const filteredRifas = rifas.filter(r => r.NumeroRifa.numero.toString().includes(searchTerm));

    return (
        <>
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Vender</header>
            </div>

            {/* Buscador con botón */}
            <div className="search-bar search-bar_asign search-bar__rifas">
                <input
                    type="text"
                    placeholder="Buscar por número de rifa..."
                    value={inputQuery}
                    onChange={e => setInputQuery(e.target.value)}
                />
                <button className="search-bar__submit-button" onClick={handleSearch}>🔍</button>
            </div>

            {selectedRifa && <div className="overlay" onClick={() => setSelectedRifa(null)} />}

            <div className="rifas__manuales">
                {/* Si se buscó y no hay resultados */}
                {searchTerm && filteredRifas.length === 0 && (
                    <p className="rifa-no-encontrada">No se encontró ninguna rifa. Intenta otro número.</p>
                )}

                {/* Mostrar rifas filtradas */}
                {filteredRifas.map(rifa => (
                    <div
                        key={rifa.NumeroRifa._id}
                        className={`rifa-card ${selectedRifa === rifa.NumeroRifa._id ? 'expanded' : ''}`}
                        onClick={e => { e.stopPropagation(); setSelectedRifa(rifa.NumeroRifa._id); }}
                    >
                        <h3>{rifa.NumeroRifa.numero}</h3>

                        {selectedRifa === rifa.NumeroRifa._id && (
                            <div className="rifa-form" onClick={e => e.stopPropagation()}>
                                <input
                                    type="text"
                                    placeholder="Nombre del comprador"
                                    value={rifa.nombreParticipante}
                                    onChange={e => setRifas(prev => prev.map(r =>
                                        r.NumeroRifa._id === rifa.NumeroRifa._id
                                            ? { ...r, nombreParticipante: e.target.value }
                                            : r
                                    ))}
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="text"
                                    placeholder="Cédula del comprador"
                                    value={rifa.ciParticipante}
                                    onChange={e => setRifas(prev => prev.map(r =>
                                        r.NumeroRifa._id === rifa.NumeroRifa._id
                                            ? { ...r, ciParticipante: e.target.value }
                                            : r
                                    ))}
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="email"
                                    placeholder="Email del comprador"
                                    value={rifa.emailParticipante}
                                    onChange={e => setRifas(prev => prev.map(r =>
                                        r.NumeroRifa._id === rifa.NumeroRifa._id
                                            ? { ...r, emailParticipante: e.target.value }
                                            : r
                                    ))}
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono del comprador"
                                    value={rifa.telefonoParticipante}
                                    onChange={e => setRifas(prev => prev.map(r =>
                                        r.NumeroRifa._id === rifa.NumeroRifa._id
                                            ? { ...r, telefonoParticipante: e.target.value }
                                            : r
                                    ))}
                                    disabled={rifa.vendida}
                                />
                                <label>Método de pago:</label>
                                <select
                                    value={rifa.metodoPago}
                                    onChange={e => setRifas(prev => prev.map(r =>
                                        r.NumeroRifa._id === rifa.NumeroRifa._id
                                            ? { ...r, metodoPago: e.target.value }
                                            : r
                                    ))}
                                    disabled={rifa.vendida}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="pos">POS</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                                <button
                                    onClick={() => venderRifa(rifa.NumeroRifa._id)}
                                    disabled={rifa.vendida}
                                >
                                    {rifa.vendida ? 'Vendida' : 'Vender'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};
