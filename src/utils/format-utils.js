/**
 * @module {Function} utils.formatUtils formatUtils
 * @parent utils
 *
 * @description Utils to format content for display.
 *
 */
var $ = require('jquery');

module.exports = {

    /**
     * @signature 'formatUtils.trimString()'
     * @param string
     * @return {*}
     * @body
     * ## Use
     *
     * ```js
     * var formatUtils = require('sheriff-ui/utils/format-utils');
     *
     * formatUtils.formatServerDateParams(' hello '});
     * ```
     */
    trimString: function (string) {
        if (string && string.trim) {
            string = string.trim();
        }
        return string;
    }
};
