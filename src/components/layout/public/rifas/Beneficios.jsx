import React, { useEffect } from 'react'
import minimalStudio from '../../../../assets/img/beneficios/minimal-studio.png';
import luzYForma from '../../../../assets/img/beneficios/luz-y-forma.png';
import drewFeig from '../../../../assets/img/beneficios/drew-feig.png';
import luzModerna from '../../../../assets/img/beneficios/luz-moderna.png';
import ecoArchitects from '../../../../assets/img/beneficios/eco-architects.png';
import ergoLiving from '../../../../assets/img/beneficios/ergo-living.png';
import corpDesign from '../../../../assets/img/beneficios/corp-design.png';
import decoExpress from '../../../../assets/img/beneficios/deco-express.png';
import sillasUnicas from '../../../../assets/img/beneficios/sillas-unicas.png';
import comedoresAut from '../../../../assets/img/beneficios/comedor-aut.png';
import texturasVivas from '../../../../assets/img/beneficios/texturas-vivas.png';
import contruccionVerde from '../../../../assets/img/beneficios/construccion-viviente.png';
import espacioModular from '../../../../assets/img/beneficios/espacio-modular.png';
import artWallStudio from '../../../../assets/img/beneficios/artwall-studio.png';
import verdeUrbano from '../../../../assets/img/beneficios/verde-urbano.png';
import designProy from '../../../../assets/img/beneficios/3ddesign-projects.png';
import workSpace from '../../../../assets/img/beneficios/workspace-studio.png';
import decoAcad from '../../../../assets/img/beneficios/deco-academy.png';
import GamaSnore from '../../../../assets/img/beneficios/GamaSnore.png';
import digitalHome from '../../../../assets/img/beneficios/digital-home.png';

export const Beneficios = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    const beneficios = [
        { titulo: "Minimal Studio", descripcion: "30% de descuento en diseños personalizados de muebles minimalistas", imagen: minimalStudio },
        { titulo: "Drew Feig", descripcion: "15% de descuento en asesoramiento para remodelación de interiores", imagen: drewFeig },
        { titulo: "Luz Moderna", descripcion: "2x1 en lámparas modernas de diseño exclusivo", imagen: luzModerna },
        { titulo: "EcoArquitectos", descripcion: "50% de descuento en planos para proyectos residenciales sustentables", imagen: ecoArchitects },
        { titulo: "ErgoLiving", descripcion: "10% de descuento en sofás de diseño ergonómico", imagen: ergoLiving },
        { titulo: "CorpDesign", descripcion: "Primer asesoramiento gratis para proyectos arquitectónicos corporativos", imagen: corpDesign },
        { titulo: "Deco Express", descripcion: "Envío gratuito en compras de más de $500 en artículos decorativos", imagen: decoExpress },
        { titulo: "Sillas Únicas", descripcion: "20% de descuento en sillas de autor seleccionadas", imagen: sillasUnicas },
        { titulo: "Comedores de Autor", descripcion: "Regalo exclusivo por cada compra de una mesa de comedor", imagen: comedoresAut },
        { titulo: "Texturas Vivas", descripcion: "Hasta 40% de descuento en alfombras de diseño geométrico", imagen: texturasVivas },
        { titulo: "Construcción Verde", descripcion: "15% de descuento en materiales para proyectos de construcción ecológica", imagen: contruccionVerde },
        { titulo: "Espacio Modular", descripcion: "25% de descuento en estanterías modulares personalizables", imagen: espacioModular },
        { titulo: "ArtWall Studio", descripcion: "10% de descuento en pinturas murales personalizadas", imagen: artWallStudio },
        { titulo: "Verde Urbano", descripcion: "Consulta inicial gratuita para proyectos de paisajismo", imagen: verdeUrbano },
        { titulo: "3DDesign Proyectos", descripcion: "Diseño digital 3D sin costo al contratar remodelaciones completas", imagen: designProy },
        { titulo: "WorkSpace Studio", descripcion: "Regalo de accesorios por la compra de un escritorio de diseño", imagen: workSpace },
        { titulo: "Luz y Forma", descripcion: "Hasta 35% de descuento en luminarias para estudios y oficinas", imagen: luzYForma },
        { titulo: "Academia Deco", descripcion: "20% de descuento en cursos de diseño de interiores online", imagen: decoAcad },
        { titulo: "GamaSnore", descripcion: "Hasta 25% de descuento en cabeceras de cama personalizadas", imagen: GamaSnore },
        { titulo: "Estilo Digital Home", descripcion: "10% de descuento adicional en compras realizadas con métodos de pago digital", imagen: digitalHome },
    ];




    return (
        <div className="beneficios_container">
            <div className="container-banner__beneficios">
                <header className='beneficios_header'>Beneficios</header>
            </div>
            <div className="beneficios_cards">
                {beneficios.map((beneficio, index) => (
                    <div className="beneficio_card" key={index}>
                        <img src={beneficio.imagen} alt={beneficio.descripcion} className="beneficio_imagen" />
                        <div className="beneficio_texto">
                            <h2>{beneficio.titulo}</h2>
                            <p>{beneficio.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
