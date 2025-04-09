// components/MetaProgreso.js
import React, { useEffect, useState } from "react";
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

    return (
        <div style={{ width: 150, height: 150 }}>
            {progreso !== null ? (
                <CircularProgressbar
                    value={progreso}
                    text={`${progreso}%`}
                    styles={buildStyles({
                        textSize: "16px",
                        pathColor: "#4caf50",
                        textColor: "#000",
                        trailColor: "#eee",
                    })}
                />
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default MetaProgreso;
