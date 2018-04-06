var AppLog = require('seo-ui/models/application-log/application-log');

/**
 * @module {Function} api.utils.log-handlers.serverLogApiHandler serverLogApiHandler
 * @parent api.utils.log-handerls
 * @description A log handler that writes log entries to the logging API.
 *
 * @param {Object} logData the log entry object returned by the logging provider.
 */
module.exports = function serverLogApiHandler(logData) {
    var appLog = new AppLog({
        message: logData.logEntry,
        level: logData.level
    });
    appLog.save();
};
