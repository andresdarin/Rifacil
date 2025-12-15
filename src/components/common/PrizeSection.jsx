import React from 'react';
import { PrizeCard } from './PrizeCard.jsx';

/**
 * PrizeSection - Container for all prize cards
 * Dynamically renders prizes from an array, alternating layout automatically
 * 
 * @param {Array} prizes - Array of prize objects
 */
export const PrizeSection = ({ prizes = [] }) => {
    // Default prizes data if none provided
    const defaultPrizes = [
        {
            title: 'Primer Premio',
            mainName: 'APARTAMENTO',
            subtitle: 'Edificio SPAZIO IV, padrón 30511/404, calle Gabriel Pereira No. 3125',
            description: 'Un apartamento moderno y luminoso con vistas panorámicas, ubicado en el corazón de la ciudad. Diseño contemporáneo, cocina equipada, y espacios amplios para disfrutar del confort urbano en cada rincón.',
            imageClass: 'column1',
            contentClass: 'column2',
            imageAriaLabel: 'Imagen del apartamento'
        },
        {
            title: 'Segundo Premio',
            mainName: 'CAMIONETA',
            subtitle: 'HYUNDAI Modelo Creta Safe Automática',
            description: 'Un SUV moderno y seguro, con transmisión automática y tecnología avanzada, ideal para quienes buscan confort y confiabilidad en cada viaje.',
            imageClass: 'column4',
            contentClass: 'column3',
            imageAriaLabel: 'Imagen de la camioneta'
        },
        {
            title: 'Tercer Premio',
            mainName: 'CRUCERO A GRECIA',
            subtitle: 'All inclusive en Grecia',
            description: 'Disfruta de un viaje todo incluido a Grecia, con 8 noches que incluyen un emocionante crucero. Explora islas fascinantes y sumérgete en la cultura griega con comodidad absoluta.',
            imageClass: 'column5',
            contentClass: 'column6',
            imageAriaLabel: 'Imagen del crucero'
        }
    ];

    const prizesToRender = prizes.length > 0 ? prizes : defaultPrizes;

    return (
        <section id="prizes-section" className="prizes-section">
            {prizesToRender.map((prize, index) => (
                <PrizeCard
                    key={index}
                    prize={prize}
                    reverseLayout={index % 2 === 1}
                />
            ))}
        </section>
    );
};

