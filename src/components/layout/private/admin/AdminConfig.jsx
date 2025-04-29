import React, { useState, useEffect, useRef } from 'react';
import { Global } from '../../../../helpers/Global';

export const AdminConfig = () => {
    const [adminData, setAdminData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmarPassword: '',
        avatar: '/src/assets/img/user.png'  // Ruta de la imagen por defecto
    });

    const [avatarPreview, setAvatarPreview] = useState(adminData.avatar); // Preview del avatar
    const fileInputRef = useRef(null); // Referencia al input de archivo
    const [saved, setSaved] = useState('not_sended');
    const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar mensajes de error

    useEffect(() => {
        // Cambia el fondo de la página
        document.body.style.backgroundImage = "url('/src/assets/img/BackGorundVendedor.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // Limpia el fondo al desmontar el componente
        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const handleInputChange = (e) => {
        setAdminData({
            ...adminData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (adminData.password !== adminData.confirmarPassword) {
            setErrorMessage("Las contraseñas no coinciden");
            setSaved('error');
            return;
        }

        const token = localStorage.getItem('token');
        const data = {
            nombre: adminData.nombre,
            email: adminData.email,
            password: adminData.password
        };

        try {
            const response = await fetch(`${Global.url}usuario/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                if (response.ok) {
                    setSaved('saved');
                    setErrorMessage('');
                } else {
                    setSaved('error');
                    setErrorMessage(result.message || 'Error al actualizar el perfil');
                }
            } else {
                setSaved('error');
                setErrorMessage("Error inesperado en el servidor. Verifica la URL o el token.");
            }
        } catch (error) {
            setSaved('error');
            setErrorMessage('Error en el servidor: ' + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result); // Actualiza la vista previa
            };
            reader.readAsDataURL(file);
            setAdminData({
                ...adminData,
                avatar: file  // Almacena el archivo de imagen en los datos del administrador
            });
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Activa el input de archivo
    };

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__vendedor-config'>Editar Perfil</header>
            </div>
            <div className="config-admin-w-avatar">
                {/* Imagen del Avatar */}
                <div className="config-admin-w-avatar">
                    <div className="avatar-preview" onClick={handleImageClick}>
                        <img src={avatarPreview} alt="Avatar" className="avatar-img" />
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </div>
                    <form className="form__admin-config" onSubmit={handleFormSubmit}>
                        <div className="form-group form-group__config">
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder='Nombre'
                                value={adminData.nombre}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group form-group__config">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Email'
                                value={adminData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group form-group__config">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder='Nueva Contraseña'
                                value={adminData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group form-group__config">
                            <input
                                type="password"
                                id="confirmarPassword"
                                name="confirmarPassword"
                                placeholder='Confirmar Contraseña'
                                value={adminData.confirmarPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Mensajes de estado */}
                        {saved === 'saved' && (
                            <strong className='alert alert_edit alert-success'>Perfil actualizado correctamente</strong>
                        )}
                        {saved === 'error' && errorMessage && (
                            <strong className='alert alert_edit alert-danger'>{errorMessage}</strong>
                        )}

                        <button type="submit" className="admin-config__submit-button">
                            <i className="fa fa-save" aria-hidden="true"></i>
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};
