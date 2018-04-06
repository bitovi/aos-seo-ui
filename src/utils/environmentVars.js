module.exports = {
    rootApp: function () {
        return process.env.NODE_ENV !== 'window-production' ? '' : '{@ROUTE_ROOT}';
    },
    apiUrl: function () {
        return process.env.NODE_ENV !== 'window-production' ? '/apiProxy' : '{@API_URL}';
    },
    isDeployedBuild: function () {
        return process.env.NODE_ENV === 'window-production' ? 'true' : 'false';
    }
};
