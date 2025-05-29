import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../../../helpers/Global';
import MetaProgreso from './Profile/MetaProgreso';
import { RifasAsignadas } from './Profile/RifasAsignadas';
import { Clientes } from './Profile/Clientes';

export const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendedor, setVendedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const año = 2025;

    useEffect(() => {
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

                if (!response.ok) {
                    throw new Error(`Error al obtener el vendedor: ${response.statusText}`);
                }

                const data = await response.json();

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

    const avatarUrl = vendedor.imagen
        ? `${Global.url}usuario/avatar/${vendedor.imagen}`
        : null;

    return (
        <div className='container-banner_metas'>
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__vendedor_prof'>{vendedor.nombreUsu}</header>

                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="Avatar del vendedor"
                        className="avatar__vendedor"
                        onError={(e) => {
                            console.warn("Error cargando avatar:", e);
                            e.target.style.display = 'none'; // oculta si falla
                        }}
                    />
                )}
            </div>

            <section>
                <MetaProgreso userId={id} año={año} />
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
