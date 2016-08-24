var can = require('can');

require('can/map/define/define');
require('can/view/stache/stache');

module.exports = can.Map.extend({
    define: {
        /**
         * @property {Array} buttons
         * @description The buttons used in the modal’s footer.
         */
        buttons: {
            value: function () {
                return [
                    {
                        classes: 'continue-export',
                        style: 'secondary',
                        text: 'Continue Export',
                        closeModal: false
                    },
                    {
                        style: 'default',
                        text: 'Cancel Export',
                        closeModal: true
                    }
                ];
            }
        },

        /**
         * @property {String} dialogName
         * @description The ID used for the modal/overlay.
         */
        dialogName: {
            type: 'string',
            value: 'export-urls-modal'
        }
    }

});
