import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../components/user/Login'


export const Rutas = () => {
    return (
        <div>
            <BrowserRouter>
                <div className="header-nav"></div>
                <section id="content">
                    <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/home' />


                        <Route path="*" element={
                            <div>
                                <h1>Error 404</h1>
                            </div>
                        } />
                    </Routes>
                </section>




            </BrowserRouter>
        </div>
    )
}
