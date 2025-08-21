import { useEffect } from 'react';

const useBodyBackground = (imageUrl) => {
    useEffect(() => {
        // Establece la imagen de fondo dinámicamente
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "cover"; // Asegura que la imagen cubra toda la pantalla
        document.body.style.backgroundPosition = "center center"; // Centra la imagen
        document.body.style.backgroundAttachment = "fixed"; // Fija la imagen al hacer scroll
        document.body.style.backgroundRepeat = "no-repeat"; // No repite la imagen
        document.body.style.height = "100vh"; // Asegura que el body ocupa toda la altura de la ventana
        document.body.style.margin = "0"; // Elimina el margen por defecto que puede afectar el fondo

        // Limpiar el fondo cuando el componente se desmonta o se cambia la imagen
        return () => {
            document.body.style.backgroundImage = ''; // Limpiar el fondo
            document.body.style.height = ''; // Restaurar la altura original
            document.body.style.margin = ''; // Restaurar el margen original
        };
    }, [imageUrl]);
};

export default useBodyBackground;
