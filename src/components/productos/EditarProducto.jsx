import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';

const EditarProducto = ({ producto, showHeroSection, showFormSection, reloadProductos }) => {
    const [formData, setFormData] = useState({
        nombreProducto: '',
        precio: '',
        descripcion: ''
    });

    useEffect(() => {
        if (producto) {
            setFormData({
                nombreProducto: producto.nombreProducto,
                precio: producto.precio,
                descripcion: producto.descripcion || ''
            });
        }
    }, [producto]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const saveProducto = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${Global.url}producto/modificarProducto/${producto._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                reloadProductos();
            } else {
                alert(result.message || 'Error al editar el producto');
            }
        } catch (error) {
            alert('Error en el servidor: ' + error.message);
        }
    };

    return (
        <form className="edit-producto__form" autoComplete="off" onSubmit={saveProducto}>

            <div className="form-group__edit">
                <input
                    placeholder="Nombre"
                    type="text"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleInputChange}
                    required
                />
                <input
                    placeholder="Precio"
                    type="text"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group__edit">
                <textarea
                    placeholder="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                ></textarea>
                <button type="submit" className="edit-producto__submit-button">
                    <i className="fa fa-save" aria-hidden="true"></i>
                </button>
            </div>
        </form>
    );
};

export default EditarProducto;
