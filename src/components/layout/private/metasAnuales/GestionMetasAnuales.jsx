import React, { useState, useEffect } from 'react';
import { Global } from '../../../../helpers/Global';

export const GestionMetasAnuales = () => {
    const [metaVentas, setMetaVentas] = useState('');
    const [año, setAño] = useState(new Date().getFullYear());
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [vendedores, setVendedores] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchVendedores = async () => {
            try {
                const response = await fetch(Global.url + 'usuario/vendedores/activos');
                const data = await response.json();

                if (data.status === 'success') {
                    setVendedores(data.vendedores);
                } else {
                    setError('Error al cargar vendedores');
                }
            } catch (err) {
                setError('Error al conectar con el servidor');
            }
        };

        fetchVendedores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(Global.url + 'meta-anual/establecer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    userId,
                    metaVentas: parseInt(metaVentas),
                    año: parseInt(año)
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setMensaje('Meta anual creada con éxito');
                setMetaVentas('');
            } else {
                setError(data.message || 'Hubo un error al crear la meta');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div className='container-metas-anuales'>
            <div className="container-banner__productos">
                <header className='header__vendedor header__admin'>Metas Anuales</header>
            </div>
            <div className="gestion-metas">

                <h1>Establecer Meta Anual</h1>
                <form className='form-group' onSubmit={handleSubmit}>
                    <div>
                        <select
                            className="form-group form-group-select"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        >
                            <option value="">-- Selecciona un vendedor --</option>
                            {vendedores.map((vendedor) => (
                                <option key={vendedor._id} value={vendedor._id}>
                                    {vendedor.nombreCompleto}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input
                            className='form-group'
                            type="number"
                            placeholder='Nueva Meta'
                            value={metaVentas}
                            onChange={(e) => setMetaVentas(e.target.value)}
                            required
                            min={1}
                        />
                    </div>

                    <div>
                        <input
                            className='form-group'
                            type="number"
                            value={año}
                            onChange={(e) => setAño(e.target.value)}
                            min={new Date().getFullYear()}
                            required
                        />
                    </div>

                    <button className='btn-asignar' type="submit">Guardar Meta</button>
                </form>

                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

        </div>

    );
};
