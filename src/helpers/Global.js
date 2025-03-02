export const Global = {
    url: import.meta.env.MODE === "development"
        ? "http://localhost:4001/api/"
        : import.meta.env.VITE_API_URL
};
//Si ejecutas npm run dev, usará localhost
//Si está en producción en Amplify, usará la URL de Elastic Beanstalk