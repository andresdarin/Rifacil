import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Contacto = ({ showHeroSection = true, showFormSection = true }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        mensaje: "",
    });

    useEffect(() => {
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    const [respuesta, setRespuesta] = useState("");

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const enviarContacto = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(Global.url + 'contacto/contacto', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Mensaje enviado correctamente.", {
                    autoClose: 2000,
                });
                setFormData({ nombre: "", email: "", mensaje: "" });
            } else {
                toast.error(result.message || "Error al enviar el mensaje.", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error("Error en el servidor: " + error.message, {
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="contacto__container">
            {showHeroSection && (
                <div className="container-banner__contacto">
                    <header className='header__contacto'>Contacto</header>
                </div>
            )}
            {showFormSection && (
                <div className="card-layout__contacto">
                    <form className="contacto__form" autoComplete="off" onSubmit={enviarContacto}>
                        <div>
                            <h1 className='card-title'></h1>
                        </div>
                        <div>
                            <div className="form-group">
                                <input
                                    placeholder="Nombre"
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    placeholder="Mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="contacto__submit-button">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Contacto;
