/**
* @module {can.Component} status-badges status-badges
* @parent components
*
*
* @description
*
*
* @signature '<seo-status-badges></seo-status-badges>'
*
* @param {can.Map}
*
* @body
*
* ## Component Initialization
*
* ```html
*   '<seo-status-badges status="{{status}}"></seo-status-badges>'
* ```
*
* @demo ../../src/components/status-badges/demo/demo.html
*/
var can = require('can');
var ViewModel = require('./status-badges.viewmodel');
require('can/view/stache/');
var template = require('./status-badges.stache!');

module.exports = can.Component.extend({
    tag: 'seo-status-badges',
    template: template,
    viewModel: ViewModel,
    helpers: {
        /**
         * @description Sets the css class that will display the appropriate color for the product status
         */
        statusColorClass: function (statusVal) {
            var status = can.isFunction(statusVal) ? statusVal() : statusVal;
            var statusClass;

            if (status) {
                switch (status.toUpperCase()) {
                    case 'ADDED':
                        statusClass = 'added';
                        break;
                    case 'MODIFIED':
                        statusClass = 'modified';
                        break;
                    case 'END-OF-LIFE':
                        statusClass = 'endOfLife';
                        break;
                    default:
                        statusClass = 'others';
                        break;
                }
            }
            return statusClass;
        }
    }
});
