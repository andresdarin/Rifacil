import React, { useState, useEffect } from 'react';
import { Global } from '../../../../helpers/Global'; // Ajusta la ruta según tu proyecto
import { ListadoVendedores } from '../vendedor/ListadoVendedores';
import ListadoProductos from '../../../productos/ListadoProductos';
import AltaProducto from '../../../productos/AltaProducto';
import Tendencias from '../../../productos/Tendencias';

export const Profile = () => {
	const [userImage, setUserImage] = useState('/src/assets/img/user.png');

	useEffect(() => {
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundPosition = "center";

		const stored = localStorage.getItem('user');
		if (stored) {
			const me = JSON.parse(stored);
			const token = localStorage.getItem('token');
			fetch(`${Global.url}usuario/profile/${me.id}`, {
				headers: { 'Authorization': token }
			})
				.then(res => res.json())
				.then(json => {
					if (json.status === 'success' && json.user) {
						if (json.user.imagen) {
							const urlImagen = `${Global.url.replace(/\/$/, '')}/uploads/avatars/${json.user.imagen}?t=${new Date().getTime()}`;
							setUserImage(urlImagen);
						}
					}
				})
				.catch(err => {
					console.error('Error al cargar imagen de usuario:', err);
				});
		}

		return () => {
			document.body.style.backgroundImage = '';
		};
	}, []);

	return (
		<div className="container-banner_main">
			<div
				className="container-banner__vendedor"
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
			>
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
