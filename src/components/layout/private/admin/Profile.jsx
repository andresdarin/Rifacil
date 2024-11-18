import React, { useState, useEffect } from 'react';
import { ListadoVendedores } from '../vendedor/ListadoVendedores'
import ListadoProductos from '../../../productos/ListadoProductos';
import AltaProducto from '../../../productos/AltaProducto';
import Tendencias from '../../../productos/Tendencias';


export const Profile = () => {
	useEffect(() => {
		document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundPosition = "center";

		return () => {
			document.body.style.backgroundImage = '';
		};
	}, []);

	return (
		<div>
			<div className="container-banner__vendedor">
				<header className='header__vendedor'>Admin</header>
			</div>
			<div className="profile-content">
				<Tendencias />
				<ListadoVendedores />
				<AltaProducto showHeroSection={false} showFormSection={false} />
				<ListadoProductos showHeroSection={false} showFormSection={false} />
			</div>
		</div>
	);
};
