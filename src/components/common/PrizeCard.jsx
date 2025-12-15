import React from 'react';

/**
 * PrizeCard - Individual prize display component
 * Renders prize information with image and content sections
 * 
 * @param {Object} prize - Prize data object
 * @param {boolean} reverseLayout - Whether to reverse image/content order
 */
export const PrizeCard = ({ prize, reverseLayout = false }) => {
    const { title, mainName, subtitle, description, imageClass, contentClass, imageAriaLabel } = prize;

    return (
        <article className="columns prize-card">
            {reverseLayout ? (
                <>
                    <div className={`column ${contentClass}`}>
                        <div className="column-content">
                            <h3 className="article_subtitle">{title}</h3>
                            <h1 className="article_title">{mainName}</h1>
                            <h2 className="article_under-title">{subtitle}</h2>
                            <p className="article_paragraph">{description}</p>
                        </div>
                    </div>
                    <div 
                        className={`column ${imageClass}`} 
                        aria-label={imageAriaLabel}
                        role="img"
                    />
                </>
            ) : (
                <>
                    <div 
                        className={`column ${imageClass}`} 
                        aria-label={imageAriaLabel}
                        role="img"
                    />
                    <div className={`column ${contentClass}`}>
                        <div className="column-content">
                            <h3 className="article_subtitle">{title}</h3>
                            <h1 className="article_title">{mainName}</h1>
                            <h2 className="article_under-title">{subtitle}</h2>
                            <p className="article_paragraph">{description}</p>
                        </div>
                    </div>
                </>
            )}
        </article>
    );
};

