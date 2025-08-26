export const Global = {
    url: import.meta.env.MODE === "development"
        ? "http://localhost:4001/api/"
        : import.meta.env.VITE_API_URL
};
//Si se ejecuta npm run dev, usará localhost
//Si está en producción en Amplify, se usa la URL de Elastic Beanstalk