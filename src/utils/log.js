var log = require('pui/utils/logger');
var apiLogHandler = require('seo-ui/utils/log-handlers/serverLogApiHandler');

module.exports = {
    _logger: {},
    messageLevel: log.messageLevel,
    init: function (appState) {
        this._logger = log({
            handlers: [log.consoleHandler, log.alertHandler(appState), apiLogHandler],
            attachToGlobal: true
        });
    },
    log: function (message) {
        this._logger.log(message);
    },
    error: function (message, error) {
        this._logger.error(message, error);
    },
    warn: function (message) {
        this._logger.warn(message);
    },
    info: function (message) {
        this._logger.info(message);
    }
};
