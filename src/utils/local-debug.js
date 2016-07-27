/**
 * Adds extra debugging features to Sheriff when in the local environment
 * @param environmentVars
 * @param serverVars
 */
module.exports = function (environmentVars, serverVars) {
    if (environmentVars.environment === 'Local Gulp') {
        serverVars.attr('environment', environmentVars);
        window.serverVars = serverVars;
    }
};
