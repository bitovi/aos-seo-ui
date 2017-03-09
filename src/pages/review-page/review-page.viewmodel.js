require('can/map/define/define');

var can = require('can');

module.exports = can.Map.extend({
    define: {
		/**
		 * @property {String} review-page.viewModel.startTab startTab
		 * @description the tab show when the page loads with pui-tabs component
		 */
        startTab: {
            type: 'string',
            value: 'Enter URLs'
        },

		/**
		 * @property {Array<Object>} review-page.viewModel.tabsList tabsList
		 * @description list of tabs to show by the pui-tabs componenet
		 */
        tabsList: {
            value: [
                {
                    name: 'Enter URLs'
                },
                {
                    name: 'Upload File'
                }
            ]
        },

		/**
		 * @property {boolean} review-page.viewModel.modalOpen modalOpen
		 * @description shows if the modal window is open or not
		 */
        modalOpen: {
            type: 'boolean',
            value: false
        }
    },

    /**
     * @function review-page.viewmodel.toggleModal toggleModal
     * @description Function that toggles the Modal when Close button is clicked.
     */
    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
