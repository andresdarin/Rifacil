// src/components/admin/AdminConfig.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthProvider';
import { Global } from '../../../../helpers/Global';
import avatarPreviewImg from '../../../../assets/img/Default.png';
import { useNavigate } from 'react-router-dom';

export const AdminConfig = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [adminData, setAdminData] = useState({
        nombreCompleto: '',
        email: '',
        password: '',
        confirmarPassword: '',
        currentPassword: '',
        avatarFile: null
    });
    const [avatarPreview, setAvatarPreview] = useState(avatarPreviewImg);
    const [saved, setSaved] = useState('not_sended');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?._id;

    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id;

        if (userId) {
            fetch(`${Global.url}usuario/profile/${userId}`, {
                headers: {
                    'Authorization': token
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        const user = data.user;
                        setAdminData(prev => ({
                            ...prev,
                            nombreCompleto: user.nombreCompleto || '',
                            email: user.email || '',
                        }));
                        if (user.imagen) {
                            setAvatarPreview(Global.url + 'uploads/avatars/' + user.imagen);
                        }
                    }
                })
                .catch(err => {
                    console.error("Error al cargar el perfil del admin:", err);
                });
        }
    }, [token]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setAdminData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setAdminData(prev => ({
                ...prev,
                avatarFile: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!adminData.currentPassword) {
            setSaved('error');
            setErrorMessage('Debes ingresar tu contraseña actual para guardar los cambios.');
            return;
        }

        if (adminData.password && adminData.password !== adminData.confirmarPassword) {
            setSaved('error');
            setErrorMessage('Las contraseñas nuevas no coinciden.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nombreCompleto', adminData.nombreCompleto);
            formData.append('email', adminData.email);
            formData.append('currentPassword', adminData.currentPassword);
            if (adminData.password) formData.append('password', adminData.password);
            if (adminData.avatarFile) formData.append('image', adminData.avatarFile);

            const res = await fetch(`${Global.url}usuario/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                body: formData
            });

            const data = await res.json();

            if (data.status === 'success') {
                // Actualiza localStorage
                localStorage.setItem('user', JSON.stringify(data.user));

                // Actualiza el contexto de autenticación
                setAuth(data.user);

                setSaved('saved');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/admin/profile');
                }, 1500);
            } else {
                setSaved('error');
                setErrorMessage(data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            setSaved('error');
            setErrorMessage('Error al conectar con el servidor.');
        }
    };

    return (
        <div className='edit__layout'>
            <header className="container-banner__productos header__editar-perfil">
                <h1 className="header__vendedor">Config Admin</h1>
            </header>

            <div className="form-container sign-up">
                <div className='login-card login-card__edit'>
                    {saved === 'saved' && (
                        <strong className='alert alert-success'>
                            Datos actualizados correctamente
                        </strong>
                    )}
                    {saved === 'error' && errorMessage && (
                        <strong className='alert alert-danger'>
                            {errorMessage}
                        </strong>
                    )}

                    <div
                        className="profile-image-preview"
                        style={{ marginBottom: '15px', cursor: 'pointer' }}
                        onClick={handleImageClick}
                    >
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    <form className='form-login' onSubmit={handleSubmit}>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='nombreCompleto'
                                placeholder='Nombre completo'
                                value={adminData.nombreCompleto}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='email'
                                name='email'
                                placeholder='Correo electrónico'
                                value={adminData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='password'
                                name='password'
                                placeholder='Nueva contraseña (opcional)'
                                value={adminData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='password'
                                name='confirmarPassword'
                                placeholder='Confirmar nueva contraseña'
                                value={adminData.confirmarPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group form-group_login form-group_pass-confirm">
                            <input
                                type='password'
                                name='currentPassword'
                                placeholder='Contraseña actual'
                                value={adminData.currentPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="buttons-login buttons-register">
                            <button type="button" className='btn btn-cancelar-editar' onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className='btn btn-cancelar-editar'>Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};