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
                return [{
                    classes: 'continue-export',
                    style: 'default',
                    text: 'Continue Export',
                    closeModal: false
                }, {
                    style: 'secondary',
                    text: 'Cancel Export',
                    closeModal: true
                }];
            }
        },

        /**
         * @property {Boolean} closeDialog
         * @description used to hide or show the modal/overlay
         */
        closeDialog: {
            value: false
        },

        /**
         * @property {String} dialogName
         * @description The ID used for the modal/overlay.
         */
        dialogName: {
            value: 'exportUrlsModal'
        }
    }

});
