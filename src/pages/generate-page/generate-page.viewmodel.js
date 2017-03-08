require('can/map/define/define');

var can = require('can');

module.exports = can.Map.extend({
    define: {
        /**
         * @property generate-page.viewmodel.modalOpen
         * @description This is used to identify the state whether to show or hide the modal
         */
        modalOpen: {
            type: 'boolean',
            value: false
        }
    },

    /**
     * @function generate-page.viewmodel.toggleModal
     * @description The modal that toggles the display of an overlay of formatting requirements.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
