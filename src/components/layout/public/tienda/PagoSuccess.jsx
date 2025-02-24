import React from 'react'
import { Link } from 'react-router-dom';

const PagoSuccess = () => {
    return (
        <div className="success-container">
            <h1>¡Pago Exitoso! 🎉</h1>
            <p>Tu compra se ha procesado correctamente.</p>
            <Link to="/landing">Volver a la página principal</Link>
        </div>
    );
}

export default PagoSuccess;