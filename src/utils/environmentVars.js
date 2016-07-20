module.exports = {
    rootApp: function () {
        return process.env.NODE_ENV !== 'production' ? '' : '{@ROUTE_ROOT}';
    },
    apiUrl: function () {
        return process.env.NODE_ENV !== 'production' ? '/apiProxy' : '{@API_URL}';
    },
    isDeployedBuild: function () {
        return process.env.NODE_ENV === 'production' ? 'true' : 'false';
    }
};
