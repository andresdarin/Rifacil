// src/components/user/EditarPerfil.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';

export const EditarPerfil = () => {
    const [saved, setSaved] = useState('not_sended');
    const [serverMessage, setServerMessage] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')); // Usuario logueado
    const token = localStorage.getItem('token');

    const { form, changed, setForm } = useForm(user || {}); // Precargar los datos

    const updateUser = async (e) => {
        e.preventDefault();
        if (!form.currentPassword) {
            setSaved('error');
            setServerMessage('Debes ingresar tu contraseña para confirmar los cambios');
            return;
        }

        try {
            const request = await fetch(Global.url + 'usuario/update', {
                method: 'PUT',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });

            const data = await request.json();
            console.log("Respuesta del servidor:", data);


            if (data.status === 'success') {
                setSaved('saved');
                setServerMessage('');
                localStorage.setItem('user', JSON.stringify(data.user)); // Actualizar localStorage
                if (data.user.rol === 'admin') {
                    navigate('/admin/profile');
                } else if (data.user.rol === 'vendedor') {
                    navigate(`/vendedor/profile/${data.user._id}`);
                } else {
                    navigate('/landing');
                }
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
        const token = localStorage.getItem('token')
        const confirmDelete = window.confirm(
            '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
        );
        if (!confirmDelete) return;

        // 1. Sacar el id del usuario
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData?.id || userData?._id;
        if (!userId) {
            alert('Error interno: no se encontró el ID de usuario.');
            return;
        }

        try {
            // 2. Llamar a la ruta DELETE con el id
            const response = await fetch(
                `${Global.url}usuario/logicDelete/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // 3. Asegúrate del formato que espera tu middleware
                        'Authorization': token
                    }
                }
            );

            const result = await response.json();
            console.log("Resultado al eliminar:", result);

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


    return (
        <div className='edit__layout'>
            <header className="container-banner__vendedor">
                <h1 className="header__vendedor">Editar Perfil</h1>
            </header>

            <div className="form-container sign-up">

                <div className='login-card login-card__edit'>


                    {saved === 'saved' && (
                        <strong className='alert alert-success'>
                            Datos actualizados correctamente
                        </strong>
                    )}
                    {saved === 'error' && serverMessage && (
                        <strong className='alert alert-danger'>
                            {serverMessage}
                        </strong>
                    )}

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
                        {/* Opcionalmente puedes permitir cambiar contraseña */}
                        <div className="form-group form-group_login">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => navigate('/reset-password/' + localStorage.getItem('token'))}
                            >
                                Cambiar contraseña
                            </button>
                        </div>


                        <div className="buttons-login buttons-register">
                            <button type="button" className='btn' onClick={() => navigate(-1)}>Cancelar</button>
                            <button type="submit" className='btn'>Guardar Cambios</button>
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
