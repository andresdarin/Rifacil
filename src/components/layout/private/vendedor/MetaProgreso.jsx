import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Global } from "../../../../helpers/Global";

const MetaProgreso = ({ userId, año }) => {
    const [progreso, setProgreso] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProgreso = async () => {
            try {
                const response = await fetch(Global.url + "meta-anual/obtener-progreso-meta", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': token
                    },
                    body: JSON.stringify({ userId, año })
                });

                const data = await response.json();

                if (data.status === "success") {
                    const porcentaje = parseFloat(data.meta.progresoMeta.replace("%", ""));
                    setProgreso(porcentaje);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error al cargar el progreso:", error);
            }
        };

        fetchProgreso();
    }, [userId, año]);

    const getColor = () => {
        if (progreso <= 25) return "#ff3b3b";      // rojo
        if (progreso <= 75) return "#ffc107";      // amarillo
        return "#09de09b2";                        // verde
    };

    const getEmoji = () => {
        if (progreso <= 25) return "😱";
        if (progreso <= 75) return "😎";
        return "🔥";
    };

    const getPulseClass = () => {
        if (progreso <= 25) return "pulsoRojo";
        if (progreso <= 75) return "pulsoAmarillo";
        return "pulsoVerde";
    };

    return (
        <div className="progreso-container">
            <h1>Metas Anuales</h1>

            {/* Contenedor sin animación */}
            <div className="progreso-card-container">
                {/* Contenedor animado dinámico */}
                <div
                    className={`progreso-card ${progreso <= 25
                        ? "red"
                        : progreso <= 75
                            ? "yellow"
                            : "green"
                        }`}
                >
                    {progreso !== null ? (
                        <>
                            <CircularProgressbar
                                value={progreso}
                                text={`${progreso}%`}
                                styles={buildStyles({
                                    textSize: "18px",
                                    pathColor: getColor(),
                                    textColor: "#fff",
                                    trailColor: "transparent",
                                    strokeLinecap: "round",
                                    pathTransitionDuration: 1.5,
                                })}
                            />
                            <div className="emoji-label">{getEmoji()}</div>
                        </>

                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default MetaProgreso;
