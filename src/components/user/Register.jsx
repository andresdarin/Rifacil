import React, { useState, useRef } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import userDefaultImg from '../../assets/img/Default.png';

const Register = () => {
    const { form, changed } = useForm({});
    const [saved, setSaved] = useState('not_sended');
    const [serverMessage, setServerMessage] = useState('');
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const removeImage = () => {
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const LoginRedirect = () => {
        navigate('/login');
    };

    const saveUser = async (e) => {
        e.preventDefault();

        // Validación rápida frontend
        if (!form.password || !form.passwordRep || form.password !== form.passwordRep) {
            setSaved('error');
            setServerMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            const formData = new FormData();

            // Añadir campos del formulario
            for (const key in form) {
                formData.append(key, form[key]);
            }

            // Añadir imagen si hay
            if (avatarFile) {
                formData.append('image', avatarFile);
            }

            const res = await fetch(Global.url + 'usuario/register', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.status === 'success') {
                setSaved('saved');
                setServerMessage('');

                // Intentar login automático
                const loginRes = await fetch(Global.url + 'usuario/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                });

                const loginData = await loginRes.json();

                if (loginData.status === 'success') {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('user', JSON.stringify(loginData.user));
                    navigate('/landing');
                } else {
                    setSaved('error');
                    setServerMessage('Registro exitoso pero no se pudo iniciar sesión automáticamente.');
                    navigate('/login');
                }
            } else {
                setSaved('error');
                setServerMessage(data.message || 'Ocurrió un error inesperado');
            }
        } catch (err) {
            console.error('Error en registro:', err);
            setSaved('error');
            setServerMessage('Error al conectar con el servidor');
        }
    };

    return (
        <div className="form-container sign-up">
            <div className='login-card'>
                {saved === 'saved' && <strong className='alert alert-success'>Usuario registrado correctamente</strong>}
                {saved === 'error' && serverMessage && <strong className='alert alert-danger'>{serverMessage}</strong>}

                <form className='form-login' onSubmit={saveUser}>
                    {/* Avatar */}
                    <div className="form-group form-group_login">
                        <div
                            className="avatar-preview avatar-preview-register"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img
                                src={avatarFile ? URL.createObjectURL(avatarFile) : userDefaultImg}
                                alt="Vista previa"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Campos de texto */}
                    <div className="form-group form-group_login">
                        <input type='text' name='nombreUsu' placeholder='Nombre de usuario' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='text' name='nombreCompleto' placeholder='Nombre completo' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='text' name='ci' placeholder='Documento de identidad' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='text' name='telefono' placeholder='Teléfono' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='text' name='direccion' placeholder='Dirección' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='email' name='email' placeholder='Correo electrónico' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='password' name='passwordRep' placeholder='Repetir contraseña' onChange={changed} />
                    </div>

                    {/* Botones */}
                    <div className="buttons-login buttons-register">
                        <button type="submit" className='btn'>Registrarse</button>
                        <button type="button" className='btn' onClick={LoginRedirect}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
