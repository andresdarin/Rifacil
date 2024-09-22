import React, { useState, useEffect } from 'react';
import { ListadoVendedores } from '../vendedor/ListadoVendedores'
import ListadoProductos from '../../../productos/ListadoProductos';
import AltaProducto from '../../../productos/AltaProducto';


export const Profile = () => {

    return (
        <div>
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Admin</header>
            </div>
            <div className="profile-content">
                <ListadoVendedores />
                <AltaProducto showHeroSection={false} showFormSection={false} />
                <ListadoProductos showHeroSection={false} showFormSection={false} />
            </div>
        </div>
    );
};
