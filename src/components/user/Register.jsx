import React, { useState, useRef } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import userDefaultImg from '../../assets/img/Default.png'; // imagen por defecto

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

        try {
            let formData = new FormData();

            for (const key in form) {
                formData.append(key, form[key]);
            }

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const registerRequest = await fetch(Global.url + 'usuario/register', {
                method: 'POST',
                body: formData,
            });

            const registerData = await registerRequest.json();

            if (registerData.status === 'success') {
                setSaved('saved');
                setServerMessage('');

                const loginRequest = await fetch(Global.url + 'usuario/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const loginData = await loginRequest.json();

                if (loginData.status === 'success') {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('user', JSON.stringify(loginData.user));
                    navigate('/landing');
                } else {
                    setSaved('error');
                    setServerMessage('Registro exitoso pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión.');
                    navigate('/login');
                }
            } else {
                setSaved('error');
                setServerMessage(registerData.message || 'Ocurrió un error inesperado');
            }
        } catch (error) {
            console.error("Error en fetch:", error);
            setSaved('error');
            setServerMessage('Error al conectar con el servidor');
        }
    };

    return (
        <div className="form-container sign-up">
            <div className='login-card'>

                {saved === 'saved' && (
                    <strong className='alert alert-success'>
                        Usuario registrado correctamente
                    </strong>
                )}
                {saved === 'error' && serverMessage && (
                    <strong className='alert alert-danger'>
                        {serverMessage}
                    </strong>
                )}

                <form className='form-login' onSubmit={saveUser}>
                    <div className="form-group form-group_login">
                        <div
                            className="avatar-preview avatar-preview-register"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                            {avatarFile ? (
                                <img
                                    src={URL.createObjectURL(avatarFile)}
                                    alt="Vista previa avatar"
                                />
                            ) : (
                                <img
                                    src={userDefaultImg}
                                    alt="Imagen por defecto"
                                />
                            )}
                        </div>


                        {/* Input file oculto */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Los demás inputs */}

                    <div className="form-group form-group_login">
                        <input type='text' name='nombreUsu' placeholder='Nombre de usuario' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='text' name='nombreCompleto' placeholder='Nombre Completo' onChange={changed} />
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
                        <input type='email' name='email' placeholder='eMail' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <input type='password' name='passwordRep' placeholder='Confirma tu Contraseña' onChange={changed} />
                    </div>

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
