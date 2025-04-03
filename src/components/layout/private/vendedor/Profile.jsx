import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import { RifasAsignadas } from './RifasAsignadas';
import { Clientes } from './Clientes';

export const Profile = () => {
    const { id } = useParams(); // ID de la URL
    const navigate = useNavigate();
    const [vendedor, setVendedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirected, setRedirected] = useState(false); // Bandera para controlar la redirección

    // UseEffect para manejar el fondo de pantalla
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    useEffect(() => {
        // Obtener el userId del parámetro o del localStorage, parseando el objeto "user" si es necesario
        const storedUser = localStorage.getItem("user");
        const userId = id || (storedUser ? JSON.parse(storedUser).id : null);

        // Agregamos log para verificar los valores
        console.log("id desde useParams:", id);
        console.log("userId final:", userId);

        if (!userId && !redirected) {
            setRedirected(true);
            navigate('/vendedor/profile'); // Redirige si no hay ID
            return;
        }

        if (!userId) {
            setError('No se encontró un ID de usuario válido.');
            setLoading(false);
            return;
        }

        const fetchVendedor = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No se encontró un token de autenticación.');

                const response = await fetch(`${Global.url}usuario/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Error al obtener el vendedor.');

                const data = await response.json();

                if (data.status === 'success') {
                    setVendedor(data.user);
                } else {
                    throw new Error('El servidor no devolvió datos válidos.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendedor();
    }, [id, navigate, redirected]);

    if (loading) return <div className='center'>Cargando vendedor...</div>;
    if (error) return <div className='error_vendedor'><p>{error}</p></div>;
    if (!vendedor) return <div className='center'>No se encontró el vendedor.</div>;

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Vendedor</header>
            </div>

            <section>
                <h2>Rifas Asignadas</h2>
                <RifasAsignadas vendedorId={id} />
            </section>

            <section>
                <h2>Clientes</h2>
                <Clientes vendedorId={id} />
            </section>
        </div>
    );
};
