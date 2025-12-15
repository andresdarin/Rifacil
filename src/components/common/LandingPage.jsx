import React from 'react';
import { HeroSection } from './HeroSection.jsx';
import { PrizeSection } from './PrizeSection.jsx';
import { ListadoSorteos } from '../layout/public/ListadoSorteos.jsx';

/**
 * LandingPage - Main landing page container
 * Composed of modular sections: Hero, Prizes, and Sorteos listing
 * 
 * Structure:
 * - HeroSection: Main banner with brand and CTA
 * - PrizeSection: Dynamic prize cards with alternating layouts
 * - ListadoSorteos: Existing sorteos listing component
 */
export const LandingPage = () => {
    return (
        <>
            <HeroSection />
            <PrizeSection />
            <ListadoSorteos />
        </>
    );
}
