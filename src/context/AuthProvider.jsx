import React, { createContext, useEffect, useState } from 'react';
import { Global } from '../helpers/Global';

// Crear el contexto de autenticación
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    // Obtener el token de localStorage
    const token = localStorage.getItem("token");

    // Efecto para autenticar al usuario cuando el componente se monta
    useEffect(() => {
        authUser();
    }, []);

    const fetchData = async (url, token) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Asegúrate de que el token esté correctamente formateado
                },
            });

            // Manejar respuestas no OK
            if (!response.ok) {
                // Lanza un error con un mensaje claro que incluye el código de estado
                throw new Error(Error`fetching data: ${response.status} ${response.statusText}`);
            }

            // Convertir la respuesta a JSON
            const data = await response.json();
            return data;
        } catch (error) {
            // Manejar y mostrar errores de forma adecuada
            console.error("Error fetching data:", error);
            return null; // Devuelve null en caso de error
        }
    };

    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);
            return;
        }

        let userObj;
        try {
            userObj = JSON.parse(user);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            setLoading(false);
            return;
        }

        if (!userObj || !userObj.id) {
            console.error("User ID is undefined");
            setLoading(false);
            return;
        }

        const userId = userObj.id;

        // Verifica que userId no sea undefined antes de hacer las solicitudes
        if (userId) {
            // Asegúrate de que la URL sea correcta
            const userProfileUrl = `${Global.url}usuario/profile/${userId}`;

            const userData = await fetchData(userProfileUrl, token);

            if (userData && userData.status === "success") {
                setAuth(userData.user);
            } else {
                setAuth({});
            }
        } else {
            console.error("User ID is missing");
        }

        setLoading(false);
    };


    // Proporcionar el contexto a los componentes hijos
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;