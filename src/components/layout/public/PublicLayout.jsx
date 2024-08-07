import React from 'react'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
    return (
        <>
            {/*contenido Principal*/}
            <section className='layout__content'>
                <Outlet />
            </section>
        </>
    )
}
export default PublicLayout;