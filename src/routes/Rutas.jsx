import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export const Rutas = () => {
    return (
        <div>
            <BrowserRouter>
                <div className="header-nav"></div>
                <section id="content">
                    <Routes>
                        <Route path='/' element />
                        <Route path='/home' element />
                        <Route path='/' element />
                        <Route path='/' element />
                        <Route path='/' element />
                        <Route path='/' element />
                        <Route path='/' element />


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
