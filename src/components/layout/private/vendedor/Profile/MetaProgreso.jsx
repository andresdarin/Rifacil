import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Global } from "../../../../../helpers/Global";

const MetaProgreso = ({ userId }) => {
    const [metas, setMetas] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMetas = async () => {
            try {
                const response = await fetch(Global.url + "meta-anual/obtener-progreso-meta", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': token
                    },
                    body: JSON.stringify({ userId })
                });

                const data = await response.json();

                if (data.status === "success") {
                    setMetas(data.metas);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Error al cargar las metas:", error);
            }
        };

        fetchMetas();
    }, [userId]);

    const getColor = (progreso) => {
        if (progreso <= 25) return "#ff3b3b";      // rojo
        if (progreso <= 75) return "#ffc107";      // amarillo
        return "#09de09b2";                        // verde
    };

    const getEmoji = (progreso) => {
        if (progreso <= 25) return "😱";
        if (progreso <= 75) return "😎";
        return "🔥";
    };

    const metaDestacada = metas.reduce((max, current) => {
        return parseFloat(current.porcentajeProgreso) > parseFloat(max.porcentajeProgreso) ? current : max;
    }, metas[0]);


    return (
        <div className="progreso-container">
            <h1>Metas Anuales</h1>



            {metaDestacada && (
                <div className="meta-destacada">
                    <div className="titulo-meta">({metaDestacada.año})
                        <div className="emoji-label">{getEmoji(parseFloat(metaDestacada.porcentajeProgreso))}
                        </div>
                    </div>


                    <div className={`progreso-card-destacada ${parseFloat(metaDestacada.porcentajeProgreso) <= 25
                        ? "pulsoRojo"
                        : parseFloat(metaDestacada.porcentajeProgreso) <= 75
                            ? "pulsoAmarillo"
                            : "pulsoVerde"
                        }`}>

                        <CircularProgressbar
                            value={parseFloat(metaDestacada.porcentajeProgreso)}
                            text={`${metaDestacada.porcentajeProgreso}%`}
                            styles={buildStyles({
                                textSize: "20px",
                                pathColor: getColor(parseFloat(metaDestacada.porcentajeProgreso)),
                                textColor: "#fff",
                                trailColor: "transparent",
                                strokeLinecap: "round",
                                pathTransitionDuration: 1.5,
                            })}
                        />


                    </div>


                </div>
            )}

            <div className="progreso-card-container-multi">
                {metas
                    .filter(meta => meta.año !== metaDestacada.año)
                    .map((meta) => {
                        const progreso = parseFloat(meta.porcentajeProgreso);
                        return (
                            <div
                                key={meta.año}
                                className={`progreso-card ${progreso <= 25
                                    ? "red"
                                    : progreso <= 75
                                        ? "yellow"
                                        : "green"
                                    }`}
                            >
                                <h3>{meta.año}</h3>

                                <CircularProgressbar
                                    value={progreso}
                                    text={`${progreso}%`}
                                    styles={buildStyles({
                                        textSize: "18px",
                                        pathColor: getColor(progreso),
                                        textColor: "#fff",
                                        trailColor: "transparent",
                                        strokeLinecap: "round",
                                        pathTransitionDuration: 1.5,
                                    })}
                                />


                            </div>

                        );

                    })}
            </div>
        </div>

    );
};

export default MetaProgreso;
