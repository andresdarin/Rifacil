import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '../components/user/Login.jsx';
import Register from '../components/user/Register.jsx';
import PrivateLayout from "../components/layout/private/PrivateLayout.jsx";
import PublicLayout from "../components/layout/public/PublicLayout.jsx";
import { LandingPage } from '../components/user/LandingPage.jsx';
import { Logout } from '../components/user/Logout.jsx';
import { Profile as AdminProfile } from '../components/layout/private/admin/Profile.jsx';
import { Profile as VendedorProfile } from '../components/layout/private/vendedor/Profile.jsx';
import { AltaVendedor } from '../components/layout/private/admin/AltaVendedor.jsx';
import ListadoProductos from '../components/productos/ListadoProductos.jsx';
import Error404 from '../routes/Error404.jsx';
import Contacto from '../components/user/Contact.jsx';
import { RecoverPass } from '../components/user/RecoverPass.jsx';
import { ResetPass } from '../components/user/ResetPass.jsx';
import { AdminConfig } from '../components/layout/private/admin/AdminConfig.jsx';

export const Rutas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<PublicLayout />}>
                    <Route index element={<Login />} />
                    <Route path='login' element={<Login />} />
                    <Route path='registro' element={<Register />} />
                    <Route path='landing' element={<LandingPage />} />
                    <Route path='contacto' element={<Contacto />} />
                    <Route path='recover-pass' element={<RecoverPass />} />
                    <Route path='/reset-password/:token' element={<ResetPass />} />
                </Route>

                <Route path='/admin' element={<PrivateLayout />}>
                    <Route index element={<Login />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='perfil' element={<AdminProfile />} />
                    <Route path='alta-vendedor' element={<AltaVendedor />} />
                    <Route path='productos' element={<ListadoProductos />} />
                    <Route path='profile' element={<AdminProfile />} />
                    <Route path='admin-config' element={<AdminConfig />} />
                </Route>

                <Route path='/vendedor' element={<PrivateLayout />}>
                    <Route path='profile' element={<VendedorProfile />} />
                    <Route path='logout' element={<Logout />} />
                </Route>

                <Route path='*' element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};
