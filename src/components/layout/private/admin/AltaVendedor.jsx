import React, { useEffect, useState, useRef } from 'react'
import { useForm } from '../../../../hooks/useForm';
import { Global } from '../../../../helpers/Global';

export const AltaVendedor = () => {
    const { form, changed } = useForm({})
    const [saved, setSaved] = useState('not_sended')
    const [errorRol, setErrorRol] = useState('');

    // Estados para avatar
    const [avatarPreview, setAvatarPreview] = useState('/src/assets/img/user.png');
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const validRoles = ['vendedor']; // Define aquí los roles válidos

    const saveVendedor = async (e) => {
        e.preventDefault();

        // Validar rol
        if (!form.rol || !validRoles.includes(form.rol.toLowerCase())) {
            setErrorRol(`Rol no válido. Debe ser ${validRoles.join(', ')}`);
            setSaved('error');
            return;
        } else {
            setErrorRol('');
        }

        try {
            let newUser = { ...form };
            const formData = new FormData();

            for (const key in newUser) {
                formData.append(key, newUser[key]);
            }

            // Aquí debe ser 'image' para coincidir con multer.single('image') en backend
            if (avatarFile) {
                formData.append('image', avatarFile);
            }

            const request = await fetch(Global.url + 'usuario/registerVendedor', {
                method: 'POST',
                body: formData,
            });

            const data = await request.json();

            if (data.status === 'success') {
                setSaved('saved');
                e.target.reset();
                setAvatarPreview('/src/assets/img/user.png'); // Usa ruta correcta para imagen default
                setAvatarFile(null);
            } else {
                setSaved('error');
                console.error('Error en registro:', data.message);
            }
        } catch (error) {
            setSaved('error');
            console.error("Error en el frontend:", error);
        }
    };


    return (
        <div className="alta-vendedor__container">
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__alta-vendedor'>Alta Vendedor</header>
            </div>

            <section className="alta-vendedor__form-container">
                {saved === 'saved' && <strong className='alert alert-success'>Vendedor registrado correctamente</strong>}
                {saved === 'error' && <strong className='alert alert-danger'>Vendedor no registrado</strong>}
                {errorRol && <strong className='alert alert-warning'>{errorRol}</strong>}

                <form className="alta-vendedor__form alta-vendedor__form-img" autoComplete="off" onSubmit={saveVendedor}>

                    <div
                        className="avatar-preview avatar-preview-agregar-vendedor"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer', marginBottom: '20px' }}
                    >
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="avatar-img"
                            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="nombreUsu"
                            placeholder="Nombre de Usuario"
                            name="nombreUsu"
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="nombreCompleto"
                            placeholder="Nombre Completo"
                            name="nombreCompleto"
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            name="password"
                            required
                            autoComplete="new-password"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="ci"
                            placeholder="Cédula de Identidad"
                            name="ci"
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="email"
                            id="email"
                            placeholder="Correo Electrónico"
                            name="email"
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="tel"
                            id="telefono"
                            placeholder="Teléfono"
                            name="telefono"
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="rol"
                            placeholder='Rol'
                            name="rol"
                            required
                            autoComplete="off"
                            onChange={(e) => {
                                e.target.value = e.target.value.toLowerCase();
                                changed(e); //aca es donde cambio el rol a minussss
                            }}
                        />
                    </div>

                    <button type="submit" className="alta-vendedor__submit-button">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                </form>
            </section>
        </div>
    )
}
