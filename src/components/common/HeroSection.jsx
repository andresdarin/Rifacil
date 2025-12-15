import React from 'react';

/**
 * HeroSection - Main banner component for the landing page
 * Displays the year, brand name, and call-to-action subtitle
 */
export const HeroSection = ({ onScrollToPrizes }) => {
    const handleScrollToPrizes = () => {
        if (onScrollToPrizes) {
            onScrollToPrizes();
        } else {
            // Default behavior: scroll to prize section
            const prizeSection = document.getElementById('prizes-section');
            if (prizeSection) {
                prizeSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="container-banner" id="banner">
            <div className="banner-content">
                <div className="year-container">
                    <span className="year__landing">20</span>
                    <span className="year__landing year__landing-2">25</span>
                </div>
                <header className="header__landing">Rifácil</header>
            </div>
            <p className="subtitle__landing">Embárcate hacia la fortuna!</p>
        </section>
    );
};

