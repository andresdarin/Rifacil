import React, { useState } from "react";
import { Global } from "../../helpers/Global";

const AltaProducto = ({ showHeroSection = true, showFormSection = true, reloadProductos }) => {
    // Estado para manejar el formulario
    const [formData, setFormData] = useState({
        nombreProducto: "",
        precio: "",
        descripcion: "",
    });

    // Estado para manejar la respuesta
    const [mensaje, setMensaje] = useState("");
    const token = localStorage.getItem('token');

    // Función para manejar el cambio en los inputs del formulario
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const saveProducto = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(Global.url + 'producto/altaProducto', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setMensaje("Producto guardado correctamente");
                setFormData({ nombreProducto: "", precio: "", descripcion: "" }); // Limpiar formulario
                reloadProductos(); // Llama a la función para recargar los productos
            } else {
                setMensaje(result.message || "Error al guardar el producto");
            }
        } catch (error) {
            setMensaje("Error en el servidor: " + error.message);
        }
    };

    return (
        <div className="alta-vendedor__container">
            {/* Hero Section */}
            {showHeroSection && (
                <div className="container-banner__vendedor">
                    <header className='header__vendedor'>Productos</header>
                </div>
            )}
            {showFormSection && (
                <div className="card-layout__producto">
                    <h1 className='card-title-vertical'>Agregar</h1>
                    <form className="alta-producto__form" autoComplete="off" onSubmit={saveProducto}>
                        <div className="form-group">
                            <input
                                placeholder="Nombre"
                                type="text"
                                name="nombreProducto"
                                value={formData.nombreProducto}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Precio"
                                type="text"
                                name="precio"
                                value={formData.precio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="alta-vendedor__submit-button">
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                    </form>
                </div>
            )}

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default AltaProducto;
