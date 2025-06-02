import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthProvider';
import { Global } from '../../../../helpers/Global';
import { ListadoVendedores } from '../vendedor/ListadoVendedores';
import ListadoProductos from '../../../productos/ListadoProductos';
import AltaProducto from '../../../productos/AltaProducto';
import Tendencias from '../../../productos/Tendencias';

export const Profile = () => {
	const { auth, loading } = useContext(AuthContext);
	const [userImage, setUserImage] = useState('/src/assets/img/user.png');

	useEffect(() => {
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundPosition = "center";

		// Solo cargamos si ya terminó la validación y tenemos auth
		if (!loading && auth && auth.imagen) {
			const urlImagen = `${Global.url.replace(/\/$/, '')}/uploads/avatars/${auth.imagen}?t=${new Date().getTime()}`;
			setUserImage(urlImagen);
		}

		return () => {
			document.body.style.backgroundImage = '';
		};
	}, [auth, loading]);

	if (loading) return <p>Cargando perfil...</p>;

	return (
		<div className="container-banner_main">
			<div className="container-banner__productos">
				<header className="header__vendedor header__admin">Admin</header>
			</div>

			<div className="profile-content">
				{userImage && (
					<div className="img-container">
						<img
							className='avatar-preview avatar-img avatar-Prof'
							src={userImage}
							alt="Avatar Usuario"
						/>
					</div>
				)}
				<Tendencias />
				<ListadoVendedores />
				<AltaProducto showHeroSection={false} showFormSection={false} />
				<ListadoProductos showHeroSection={false} showFormSection={false} />
			</div>
		</div>
	);
};
