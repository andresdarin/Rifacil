import React, { useState } from 'react';

//NO FUNCIONA ESTO A CHECKEAR

const Ruleta = ({ participantes }) => {
    const [giro, setGiro] = useState(0);  // Para el ángulo de giro
    const [ganador, setGanador] = useState(null);
    const [giroEnCurso, setGiroEnCurso] = useState(false);

    const iniciarGiro = () => {
        if (giroEnCurso) return; // Evitar varios giros a la vez
        setGiroEnCurso(true);

        // Generar un ángulo de giro aleatorio
        const ganadorAleatorio = Math.floor(Math.random() * participantes.length);
        const anguloFinal = ganadorAleatorio * (360 / participantes.length) + 3600;  // Múltiples giros completos para hacerlo más realista

        setGiro(0);  // Reiniciar ángulo
        setTimeout(() => {
            setGiro(anguloFinal);
            setGanador(participantes[ganadorAleatorio]); // Establecer el ganador
            setGiroEnCurso(false);
        }, 3000); // Duración del giro
    };

    return (
        <div className="ruleta-container">
            <div
                className="ruleta"
                style={{
                    transform: `rotate(${giro}deg)`,
                    transition: 'transform 3s ease-out',  // Añadir animación de transición
                }}
            >
                {/* Dibujar los segmentos para cada participante */}
                {participantes.map((participante, index) => (
                    <div
                        key={index}
                        style={{
                            transform: `rotate(${index * (360 / participantes.length)}deg)`,
                            transformOrigin: '100% 100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            fontSize: '16px',
                            paddingTop: '10px',
                            color: '#fff',
                        }}
                    >
                        <div>{participante}</div>
                    </div>
                ))}
            </div>
            <button onClick={iniciarGiro} disabled={giroEnCurso}>
                {giroEnCurso ? 'Girando...' : 'Girar Ruleta'}
            </button>

            {ganador && !giroEnCurso && (
                <div>
                    <h3>¡Ganador!</h3>
                    <p>El ganador es: {ganador}</p>
                </div>
            )}
        </div>
    );
};

export default Ruleta;
