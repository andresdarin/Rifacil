// src/components/user/EditarPerfil.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/img/user.png';

export const EditarPerfil = () => {
    const [saved, setSaved] = useState('not_sended');
    const [serverMessage, setServerMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const imageInputRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const { form, changed, setForm } = useForm(user || {});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setForm({
                ...form,
                image: file,
            });
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        if (!form.currentPassword) {
            setSaved('error');
            setServerMessage('Debes ingresar tu contraseña para confirmar los cambios');
            return;
        }

        try {
            const formData = new FormData();

            Object.keys(form).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, form[key]);
                }
            });

            if (form.image) {
                formData.append('image', form.image);
            }

            const request = await fetch(Global.url + 'usuario/update', {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': token
                }
            });

            const data = await request.json();

            if (data.status === 'success') {
                setSaved('saved');
                setServerMessage('');

                // Mostrar mensaje y cerrar sesión luego
                setTimeout(() => {
                    localStorage.clear();
                    navigate('/login');
                }, 2000); // Espera 2 segundos para que se vea el mensaje

            } else {
                setSaved('error');
                setServerMessage(data.message || 'Ocurrió un error inesperado');
            }
        } catch (error) {
            console.error("Error en fetch:", error);
            setSaved('error');
            setServerMessage('Error al conectar con el servidor');
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        const confirmDelete = window.confirm(
            '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
        );
        if (!confirmDelete) return;

        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.id || userData?._id;
        if (!userId) {
            alert('Error interno: no se encontró el ID de usuario.');
            return;
        }

        try {
            const response = await fetch(`${Global.url}usuario/logicDelete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const result = await response.json();

            if (result.status === 'success') {
                localStorage.clear();
                navigate('/login');
            } else {
                alert('No se pudo eliminar la cuenta: ' + (result.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
            alert('Error al conectar con el servidor.');
        }
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const avatarUrl = previewImage
        ? previewImage
        : user?.imagen
            ? Global.url + 'uploads/avatars/' + user.imagen
            : defaultAvatar;

    return (
        <div className='edit__layout'>
            <header className="container-banner__productos header__editar-perfil">
                <h1 className="header__vendedor">Editar Perfil</h1>
            </header>

            <div className="form-container sign-up">
                <div className='login-card login-card__edit'>

                    {saved === 'saved' && (
                        <strong className='alert alert-success'>
                            Datos actualizados correctamente. Redirigiendo al login...
                        </strong>
                    )}
                    {saved === 'error' && serverMessage && (
                        <strong className='alert alert-danger'>
                            {serverMessage}
                        </strong>
                    )}

                    <div className="profile-image-preview" style={{ marginBottom: '15px', cursor: 'pointer' }}>
                        <img
                            src={avatarUrl}
                            alt="Imagen de perfil"
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                cursor: 'pointer'
                            }}
                            onClick={handleImageClick}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    <form className='form-login' onSubmit={updateUser}>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='nombreUsu'
                                placeholder={user.nombreUsu || 'Nuevo nombre de usuario'}
                                onChange={changed}
                                value={form.nombreUsu || ''}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='nombreCompleto'
                                placeholder={user.nombreCompleto || 'Nuevo nombre Completo'}
                                onChange={changed}
                                value={form.nombreCompleto || ''}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='ci'
                                placeholder={user.ci || 'Nuevo Documento de identidad'}
                                onChange={changed}
                                value={form.ci || ''}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='telefono'
                                placeholder={user.telefono || 'Nuevo Teléfono'}
                                onChange={changed}
                                value={form.telefono || ''}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='text'
                                name='direccion'
                                placeholder={user.direccion || 'Nuevo Dirección'}
                                onChange={changed}
                                value={form.direccion || ''}
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <input
                                type='email'
                                name='email'
                                placeholder={user.email || 'Nuevo eMail'}
                                onChange={changed}
                                value={form.email || ''}
                            />
                        </div>
                        <div className="form-group form-group_login form-group_pass-confirm">
                            <input
                                type='password'
                                name='currentPassword'
                                placeholder='Ingresa tu contraseña para guardar'
                                onChange={changed}
                                value={form.currentPassword || ''}
                                required
                            />
                        </div>
                        <div className="form-group form-group_login">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => navigate('/recover-pass')}
                            >
                                Cambiar contraseña
                            </button>
                        </div>

                        <div className="buttons-login buttons-register">
                            <button type="button" className='btn btn-cancelar-editar' onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className='btn btn-cancelar-editar'>Guardar Cambios</button>
                        </div>
                    </form>
                </div>

                <button
                    className="float-cart-button float-edit-button"
                    onClick={handleDeleteAccount}
                >
                    Borrar Cuenta Permanentemente!
                </button>
            </div>
        </div>
    );
};
