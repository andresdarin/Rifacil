import React, { useState, useEffect, useRef } from 'react';
import { Global } from '../../../../helpers/Global';

export const AdminConfig = () => {
    const [adminData, setAdminData] = useState({
        nombreCompleto: '',
        email: '',
        password: '',
        confirmarPassword: '',
        currentPassword: '',
        avatarFile: null
    });
    const [avatarPreview, setAvatarPreview] = useState('/src/assets/img/user.png');
    const fileInputRef = useRef(null);
    const [saved, setSaved] = useState('not_sended');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // fondo
        document.body.style.backgroundImage = "url('/src/assets/img/BackGorundVendedor.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // cargar perfil
        const stored = localStorage.getItem('user');
        if (stored) {
            const me = JSON.parse(stored);
            const token = localStorage.getItem('token');
            fetch(`${Global.url}usuario/profile/${me.id}`, {
                headers: { 'Authorization': token }
            })
                .then(res => res.json())
                .then(json => {
                    console.log('Perfil usuario:', json);
                    if (json.status === 'success') {
                        const u = json.user;
                        setAdminData({
                            nombreCompleto: u.nombreCompleto || '',
                            email: u.email || '',
                            password: '',
                            confirmarPassword: '',
                            currentPassword: '',
                            avatarFile: null
                        });
                        if (u.imagen) {
                            const urlImagen = `${Global.url.replace(/\/$/, '')}/uploads/avatars/${u.imagen}?t=${new Date().getTime()}`;
                            console.log('Seteando avatar:', urlImagen);
                            setAvatarPreview(urlImagen);
                        }
                    } else {
                        console.warn('No se pudo cargar el perfil:', json.message);
                        setSaved('error');
                        setErrorMessage("Error al cargar el perfil de usuario");
                    }
                })
                .catch(err => {
                    console.error("Error al cargar perfil:", err);
                    setSaved('error');
                    setErrorMessage("Error al cargar el perfil de usuario");
                });
        }

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);


    const handleInputChange = e => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setAdminData({ ...adminData, avatarFile: file });
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        // validaciones
        if (adminData.password && adminData.password !== adminData.confirmarPassword) {
            setErrorMessage("Las contraseñas no coinciden");
            setSaved('error');
            return;
        }
        if (!adminData.currentPassword) {
            setErrorMessage("Debes ingresar tu contraseña actual");
            setSaved('error');
            return;
        }

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('nombreCompleto', adminData.nombreCompleto);
        formData.append('email', adminData.email);
        formData.append('currentPassword', adminData.currentPassword);
        if (adminData.password) formData.append('password', adminData.password);

        // Cambiar "imagen" por "image" para que coincida con el nombre esperado en el backend
        if (adminData.avatarFile) formData.append('image', adminData.avatarFile);

        try {
            setSaved('saving'); // Añadir estado de guardando para mejor UX
            const res = await fetch(`${Global.url}usuario/update`, {
                method: 'PUT',
                headers: { 'Authorization': token },
                body: formData
            });
            const json = await res.json();
            if (res.ok) {
                setSaved('saved');
                setErrorMessage('');
                // Actualizar la imagen mostrada y el localStorage
                if (json.user && json.user.imagen) {
                    setAvatarPreview(`${Global.url}uploads/avatars/${json.user.imagen}`);

                    // Actualizar también el usuario en localStorage
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    if (storedUser) {
                        storedUser.imagen = json.user.imagen;
                        localStorage.setItem('user', JSON.stringify(storedUser));
                    }
                }

                // Limpiar contraseñas
                setAdminData(prev => ({
                    ...prev,
                    password: '',
                    confirmarPassword: '',
                    currentPassword: '',
                }));
            } else {
                setSaved('error');
                setErrorMessage(json.message || 'Error al actualizar el perfil');
            }
        } catch (err) {
            setSaved('error');
            setErrorMessage('Error en el servidor: ' + err.message);
        }
    };

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__vendedor-config'>Editar Perfil</header>
            </div>
            <div className="config-admin-w-avatar">
                <div className="avatar-preview avatar-Prof" onClick={handleImageClick}>
                    <img src={avatarPreview} alt="Avatar" className="avatar-img" />

                    <input
                        type="file"
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
                            name="nombreCompleto"
                            placeholder='Nombre Completo'
                            value={adminData.nombreCompleto}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group form-group__config">
                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={adminData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group form-group__config">
                        <input
                            type="password"
                            name="password"
                            placeholder='Nueva Contraseña'
                            value={adminData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group form-group__config">
                        <input
                            type="password"
                            name="confirmarPassword"
                            placeholder='Confirmar Contraseña'
                            value={adminData.confirmarPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group form-group__config">
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder='Contraseña Actual'
                            value={adminData.currentPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {saved === 'saving' && (
                        <strong className='alert alert_edit alert-info'>
                            Guardando cambios...
                        </strong>
                    )}
                    {saved === 'saved' && (
                        <strong className='alert alert_edit alert-success'>
                            Perfil actualizado correctamente
                        </strong>
                    )}
                    {saved === 'error' && errorMessage && (
                        <strong className='alert alert_edit alert-danger'>
                            {errorMessage}
                        </strong>
                    )}

                    <button type="submit" className="admin-config__submit-button">
                        <i className="fa fa-save" aria-hidden="true"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};