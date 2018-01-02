require('can/map/define/define');
var can = require('can');
var _ = require('lodash');
var anatomyItemTemplate = require('./anatomy-item.stache');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Function} url-list.viewModel.items
         * @description gets items from the state.storage.
         */
        items: {
            get: function () {
                return this.attr('state.storage')
            }
        },

        /**
         * @property {Object} actionBarMenuActions
         * @description Actions used for action-bar-menu items
         */
        actionBarMenuActions: {
            value: function() {
                return {
                    cancelRequest: can.proxy(this.cancelRequest, this)
                };
            }
        },

        /**
         * @property {Function} url-list.viewModel.anatomyItem anatomyItem
         * @description Stores the template that renders an anatomy item.
         */
        anatomyItem: {
            value: function () {
                return anatomyItemTemplate;
            }
        },
    },

    /**
     * @function edit-title-description.viewModel.cancelRequest
     * @description cancles edit title description request.
     */
    cancelRequest: function () {
        this.attr('state').setRouteAttrs({
            page: 'urls'
        });
    }

});
