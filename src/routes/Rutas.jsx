import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '../features/auth/Login.jsx';
import Register from '../features/auth/Register.jsx';
import PrivateLayout from "../components/layout/private/PrivateLayout.jsx";
import PublicLayout from "../components/layout/public/PublicLayout.jsx";
import { LandingPage } from '../components/common/LandingPage.jsx';
import { Logout } from '../features/auth/Logout.jsx';
import { Profile as AdminProfile } from '../components/layout/private/admin/Profile.jsx';
import { Profile, Profile as VendedorProfile } from '../components/layout/private/vendedor/Profile.jsx';
import { AltaVendedor } from '../components/layout/private/admin/AltaVendedor.jsx';
import ListadoProductos from '../features/productos/ListadoProductos.jsx';
import Error404 from '../routes/Error404.jsx';
import Contacto from '../components/common/Contact.jsx';
import { RecoverPass } from '../features/auth/RecoverPass.jsx';
import { ResetPass } from '../features/auth/ResetPass.jsx';
import { AdminConfig } from '../components/layout/private/admin/AdminConfig.jsx';
import { CrearRifa } from '../features/rifas/CrearRifa.jsx';
import { Historial } from '../features/rifas/Historial.jsx';
import { Sorteo } from '../features/rifas/Sorteo.jsx';
import { Premios } from '../features/rifas/Premios.jsx';
import { Asignar } from '../features/rifas/Asignar.jsx';
import { Resultado } from '../features/sorteos/Resultado.jsx';
import { Beneficios } from '../features/rifas/Beneficios.jsx';
import { Sortear } from '../features/rifas/Sortear.jsx';
import { Tienda } from '../features/tienda/Tienda.jsx';
import { Carrito } from '../features/tienda/Carrito.jsx';
import Checkout from '../features/tienda/Checkout.jsx';
import PagoSuccess from '../features/tienda/PagoSuccess.jsx';
import { PagoFailure } from '../features/tienda/PagoFailure.jsx';
import { PagoPending } from '../features/tienda/PagoPending.jsx';
import MetaProgreso from '../components/layout/private/vendedor/Profile/MetaProgreso.jsx';
import { Estadisticas } from '../components/layout/private/vendedor/Estadisticas.jsx';
import { VenderRifa } from '../components/layout/private/vendedor/VenderRifa.jsx';
import { HistorialVendedor } from '../components/layout/private/vendedor/HistorialVendedor.jsx';
import PagoRedirect from '../features/tienda/PagoRedirect.jsx';
import { EditarPerfil } from '../components/common/EditarPerfil.jsx';
import { GestionMetasAnuales } from '../features/metas/GestionMetasAnuales.jsx';


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
                    <Route path='/editarPerfil' element={<EditarPerfil />} />
                    <Route path='/tienda' element={<Tienda />} />
                    <Route path='/tienda/carrito' element={<Carrito />} />
                    <Route path='/tienda/checkout' element={<Checkout />} />
                    <Route path='/tienda/success' element={<PagoSuccess />} />
                    <Route path='/tienda/failure' element={<PagoFailure />} />
                    <Route path='/tienda/pending' element={<PagoPending />} />
                    <Route path='/tienda/pagoRedirect' element={<PagoRedirect />} />
                </Route>

                <Route path='/admin' element={<PrivateLayout />}>
                    <Route index element={<Login />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='perfil' element={<AdminProfile />} />
                    <Route path='alta-vendedor' element={<AltaVendedor />} />
                    <Route path='gestion-metas-anuales' element={<GestionMetasAnuales />} />
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
                    <Route path='editarVendedor/:id' element={<EditarPerfil />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='meta-anual/obtener-progreso' element={<MetaProgreso />} />
                </Route>


                <Route path='*' element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};
