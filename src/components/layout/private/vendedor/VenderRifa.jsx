import React, { useEffect, useState } from 'react';
import { Global } from '../../../../helpers/Global';

export const VenderRifa = () => {
    const [rifas, setRifas] = useState([]);
    const [selectedRifa, setSelectedRifa] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        const userRaw = localStorage.getItem("user");
        const userId = userRaw ? JSON.parse(userRaw).id : null;

        if (!userId) {
            console.error("No se encontró el userId en localStorage");
            return;
        }

        obtenerRifasAsignadas(userId);

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const obtenerRifasAsignadas = async (userId) => {
        try {
            const res = await fetch(Global.url + 'rifa/rifas-por-vendedor', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ userId })
            });

            const data = await res.json();

            if (data.status === "success") {
                setRifas(data.data.numerosRifa.map(num => ({
                    NumeroRifa: num,
                    nombreParticipante: '',
                    ciParticipante: '',
                    emailParticipante: '',
                    telefonoParticipante: '',
                    metodoPago: '',
                    vendida: false,
                })));
            }
        } catch (error) {
            console.error("Error al obtener rifas:", error);
        }
    };

    const venderRifa = async (numeroRifa) => {
        const rifaSeleccionada = rifas.find(r => r.NumeroRifa === numeroRifa);
        const { nombreParticipante, ciParticipante, metodoPago } = rifaSeleccionada;

        if (!nombreParticipante || !ciParticipante || !metodoPago) {
            return alert("Debes completar nombre, cédula y seleccionar el método de pago.");
        }

        try {
            const res = await fetch(Global.url + `rifa/vender/${numeroRifa}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    nombreParticipante,
                    ciParticipante,
                    pagoRealizado: true,
                    metodoPago,
                })
            });

            const data = await res.json();

            if (data.status === "success") {
                alert("Rifa vendida correctamente");
                setRifas(prev => prev.map(r =>
                    r.NumeroRifa === numeroRifa
                        ? { ...r, vendida: true }
                        : r
                ));
                setSelectedRifa(null); // Cierra la card
            } else {
                alert("Error al vender la rifa.");
            }
        } catch (error) {
            console.error("Error al vender rifa:", error);
        }
    };

    const handleInputChange = (numeroRifa, campo, valor) => {
        setRifas(prev => prev.map(r =>
            r.NumeroRifa === numeroRifa ? { ...r, [campo]: valor } : r
        ));
    };

    const handleMetodoPagoChange = (numeroRifa, valor) => {
        setRifas(prev => prev.map(r =>
            r.NumeroRifa === numeroRifa ? { ...r, metodoPago: valor } : r
        ));
    };

    const toggleCard = (numeroRifa) => {
        setSelectedRifa((prev) => prev === numeroRifa ? null : numeroRifa);
    };

    return (
        <>
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Vender</header>
            </div>

            {selectedRifa && <div className="overlay" onClick={() => setSelectedRifa(null)}></div>}

            <div className="rifas__manuales">
                {rifas.map((rifa) => (
                    <div
                        key={rifa.NumeroRifa}
                        className={`rifa-card ${selectedRifa === rifa.NumeroRifa ? 'expanded' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation(); // para evitar que se cierre inmediatamente
                            toggleCard(rifa.NumeroRifa);
                        }}
                    >
                        <h3>{rifa.NumeroRifa}</h3>

                        {selectedRifa === rifa.NumeroRifa && (
                            <div className="rifa-form" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    placeholder="Nombre del comprador"
                                    value={rifa.nombreParticipante}
                                    onChange={(e) =>
                                        handleInputChange(rifa.NumeroRifa, "nombreParticipante", e.target.value)
                                    }
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="text"
                                    placeholder="Cédula del comprador"
                                    value={rifa.ciParticipante}
                                    onChange={(e) =>
                                        handleInputChange(rifa.NumeroRifa, "ciParticipante", e.target.value)
                                    }
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="email"
                                    placeholder="Email del comprador"
                                    value={rifa.emailParticipante}
                                    onChange={(e) =>
                                        handleInputChange(rifa.NumeroRifa, "emailParticipante", e.target.value)
                                    }
                                    disabled={rifa.vendida}
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono del comprador"
                                    value={rifa.telefonoParticipante}
                                    onChange={(e) =>
                                        handleInputChange(rifa.NumeroRifa, "telefonoParticipante", e.target.value)
                                    }
                                    disabled={rifa.vendida}
                                />
                                <label>Método de pago:</label>
                                <select
                                    value={rifa.metodoPago}
                                    onChange={(e) =>
                                        handleMetodoPagoChange(rifa.NumeroRifa, e.target.value)
                                    }
                                    disabled={rifa.vendida}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="pos">POS</option>
                                    <option value="transferencia">Transferencia</option>
                                </select>
                                <button
                                    onClick={() => venderRifa(rifa.NumeroRifa)}
                                    disabled={rifa.vendida}
                                >
                                    {rifa.vendida ? "Vendida" : "Vender"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};
