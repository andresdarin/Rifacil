import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import MetaProgreso from './Profile/MetaProgreso';
import { RifasAsignadas } from './Profile/RifasAsignadas';
import { Clientes } from './Profile/Clientes';



export const Profile = () => {
    const { id } = useParams(); // ID desde la URL
    const navigate = useNavigate();
    const [vendedor, setVendedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const año = 2025;

    // Manejar el fondo de pantalla
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const userId = id || (storedUser ? JSON.parse(storedUser).id : null);

        if (!userId) {
            setError('No se encontró un ID de usuario válido.');
            setLoading(false);
            return;
        }

        const fetchVendedor = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró un token de autenticación.');
                }

                const response = await fetch(`${Global.url}usuario/profile/${userId}`, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                console.log("Respuesta completa del servidor:", response);

                if (!response.ok) {
                    throw new Error(`Error al obtener el vendedor: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Datos obtenidos:", data);

                if (data.status === 'success') {
                    setVendedor(data.user);
                } else {
                    throw new Error('El servidor no devolvió datos válidos.');
                }
            } catch (error) {
                console.error("Error en fetchVendedor:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendedor();
    }, [id]);

    if (loading) return <div className='center'>Cargando vendedor...</div>;
    if (error) return <div className='error_vendedor'><p>{error}</p></div>;
    if (!vendedor) return <div className='center'>No se encontró el vendedor.</div>;

    return (
        <div className='container-banner_metas'>
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__vendedor_prof'>{vendedor.nombreUsu}</header>
            </div>

            <section>
                <MetaProgreso userId={id} año={2025} />
            </section>
            <section>
                <RifasAsignadas vendedorId={id} año={año} />
            </section>
            <section>
                <Clientes vendedorId={id} />
            </section>
        </div>
    );
};
