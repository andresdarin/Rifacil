import React, { useState } from "react";
import { Global } from "../../helpers/Global";

const AltaProducto = ({ showHeroSection = true, showFormSection = true, reloadProductos }) => {
    const [formData, setFormData] = useState({
        nombreProducto: "",
        precio: "",
        descripcion: "",
        image: null,
    });

    const [mensaje, setMensaje] = useState("");
    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const saveProducto = async (e) => {
        e.preventDefault();

        // Validar campos obligatorios antes de enviar
        if (!formData.nombreProducto || !formData.precio) {
            setMensaje("Nombre del producto y precio son obligatorios");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("nombreProducto", formData.nombreProducto);
        formDataToSend.append("precio", formData.precio);

        // Solo agregar descripción si tiene valor
        if (formData.descripcion) {
            formDataToSend.append("descripcion", formData.descripcion);
        }

        // Solo agregar imagen si existe
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            // Consola para depuración
            console.log("Enviando datos:", {
                nombreProducto: formData.nombreProducto,
                precio: formData.precio,
                descripcion: formData.descripcion,
                image: formData.image ? formData.image.name : "No image"
            });

            const response = await fetch(Global.url + 'producto/altaProducto', {
                method: "POST",
                headers: {
                    'Authorization': token
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (response.ok) {
                setMensaje("Producto guardado correctamente");
                setFormData({
                    nombreProducto: "",
                    precio: "",
                    descripcion: "",
                    image: null
                });

                // Limpiar input de archivo
                const fileInput = document.getElementById('image-upload');
                if (fileInput) fileInput.value = '';

                // Recargar la lista de productos si existe la función
                if (typeof reloadProductos === 'function') {
                    reloadProductos();
                }
            } else {
                setMensaje(result.message || "Error al guardar el producto");
                console.error("Error del servidor:", result);
            }
        } catch (error) {
            setMensaje("Error en el servidor: " + error.message);
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="alta-producto__container">
            {showHeroSection && (
                <div className="container-banner__vendedor">
                    <header className='header__vendedor'>Productos</header>
                </div>
            )}
            {showFormSection && (
                <div className="alta-vendedor__form-container">
                    <form className="alta-producto__form" autoComplete="off" onSubmit={saveProducto}>
                        <div>
                            <h1 className='card-title'>Agregar</h1>
                        </div>
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
                                type="number"
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
                        <div className="form-group">
                            <label htmlFor="image-upload" className="custom-file-upload">
                                {formData.image ? formData.image.name : "Subir imagen"}
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </div>

                        <button type="submit" className="alta-producto__submit-button">
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                    </form>
                    {mensaje && (
                        <div className="mensaje-formulario">
                            <p>{mensaje}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AltaProducto;