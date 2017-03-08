require('can/map/define/define');

var can = require('can');

module.exports = can.Map.extend({
    define: {
        modalOpen: {
            type: 'boolean',
            value: false
        }
    },

    toggleModal: function () {
        this.attr('modalOpen', !this.attr('modalOpen'));
    }
});
