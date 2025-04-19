import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '../components/user/Login.jsx';
import Register from '../components/user/Register.jsx';
import PrivateLayout from "../components/layout/private/PrivateLayout.jsx";
import PublicLayout from "../components/layout/public/PublicLayout.jsx";
import { LandingPage } from '../components/user/LandingPage.jsx';
import { Logout } from '../components/user/Logout.jsx';
import { Profile as AdminProfile } from '../components/layout/private/admin/Profile.jsx';
import { Profile, Profile as VendedorProfile } from '../components/layout/private/vendedor/Profile.jsx';
import { AltaVendedor } from '../components/layout/private/admin/AltaVendedor.jsx';
import ListadoProductos from '../components/productos/ListadoProductos.jsx';
import Error404 from '../routes/Error404.jsx';
import Contacto from '../components/user/Contact.jsx';
import { RecoverPass } from '../components/user/RecoverPass.jsx';
import { ResetPass } from '../components/user/ResetPass.jsx';
import { AdminConfig } from '../components/layout/private/admin/AdminConfig.jsx';
import { Rifas } from '../components/layout/private/rifas/Rifas.jsx';
import { CrearRifa } from '../components/layout/private/rifas/CrearRifa.jsx';
import { Historial } from '../components/layout/private/rifas/Historial.jsx';
import { Sorteo } from '../components/layout/private/rifas/Sorteo.jsx';
import { Premios } from '../components/layout/private/rifas/Premios.jsx';
import { Asignar } from '../components/layout/private/rifas/Asignar.jsx';
import { Resultado } from '../components/layout/public/sorteos/Resultado.jsx';
import { Beneficios } from '../components/layout/public/rifas/Beneficios.jsx';
import { Sortear } from '../components/layout/private/rifas/Sortear.jsx';
import { Tienda } from '../components/layout/public/tienda/Tienda.jsx';
import { Carrito } from '../components/layout/public/tienda/Carrito.jsx';
import Checkout from '../components/layout/public/tienda/Checkout.jsx';
import PagoSuccess from '../components/layout/public/tienda/PagoSuccess.jsx';
import { PagoFailure } from '../components/layout/public/tienda/PagoFailure.jsx';
import { PagoPending } from '../components/layout/public/tienda/PagoPending.jsx';
import MetaProgreso from '../components/layout/private/vendedor/MetaProgreso.jsx';
import { Estadisticas } from '../components/layout/private/vendedor/Estadisticas.jsx';
import { VenderRifa } from '../components/layout/private/vendedor/VenderRifa.jsx';
import { HistorialVendedor } from '../components/layout/private/vendedor/HistorialVendedor.jsx';


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
                    <Route path='/resultado' element={<Resultado />} />
                    <Route path='/beneficios' element={<Beneficios />} />
                    <Route path='/tienda' element={<Tienda />} />
                    <Route path='/tienda/carrito' element={<Carrito />} />
                    <Route path='/tienda/checkout' element={<Checkout />} />
                    <Route path='/tienda/success' element={<PagoSuccess />} />
                    <Route path='/tienda/failure' element={<PagoFailure />} />
                    <Route path='/tienda/pending' element={<PagoPending />} />
                </Route>

                <Route path='/admin' element={<PrivateLayout />}>
                    <Route index element={<Login />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='perfil' element={<AdminProfile />} />
                    <Route path='alta-vendedor' element={<AltaVendedor />} />
                    <Route path='rifas/asignar' element={<Asignar />} />
                    <Route path='rifas/crear' element={<CrearRifa />} />
                    <Route path='rifas/historial' element={<Historial />} />
                    <Route path='rifas/sorteo' element={<Sorteo />} />
                    <Route path='rifas/sortear' element={<Sortear />} />
                    <Route path='rifas/premios' element={<Premios />} />
                    <Route path='productos' element={<ListadoProductos />} />
                    <Route path='profile' element={<AdminProfile />} />
                    <Route path='admin-config' element={<AdminConfig />} />
                </Route>

                <Route path='/vendedor' element={<PrivateLayout />}>
                    <Route path='profile/:id' element={<Profile />} />
                    <Route path='estadisticas/:id' element={<Estadisticas />} />
                    <Route path='historial-vendedor/:id' element={<HistorialVendedor />} />
                    <Route path='vender-rifa/:id' element={<VenderRifa />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='meta-anual/obtener-progreso' element={<MetaProgreso />} />
                </Route>


                <Route path='*' element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};
