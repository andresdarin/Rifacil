export const Global = {
    url: import.meta.env.MODE === "development"
        ? "http://localhost:4001/api/"
        : "http://rifacil-03-env.eba-4xyc4qtq.sa-east-1.elasticbeanstalk.com/api/"
};
//Si ejecutas npm run dev, usará localhost
//Si está en producción en Amplify, usará la URL de Elastic Beanstalk