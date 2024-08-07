import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../components/user/Login.jsx'
import PrivateLayout from '../components/layout/private/PrivateLayout.jsx'
import PublicLayout from "../components/layout/public/PublicLayout.jsx";


export const Rutas = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='registro' element={<Register />} />
                    </Route>

                    <Route path='/social' element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                    </Route>

                    <Route path='*' element={

                        <p>
                            <h1>Error 404</h1>
                            <Link to='/'> Volver al incio</Link>
                        </p>


                    }>

                    </Route>
                </Routes>




            </BrowserRouter>
        </div>
    )
}
