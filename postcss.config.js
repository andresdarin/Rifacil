module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 16, // 1rem = 16px
            unitPrecision: 5,
            propList: ['*'], // convierte todos los props
            selectorBlackList: [], // excluye clases si querés (ej. ['.no-rem'])
            replace: true,
            mediaQuery: false,
            minPixelValue: 0
        }
    }
};
