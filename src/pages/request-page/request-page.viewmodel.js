require('can/map/define/define');

var can = require('can');
var $ = require('jquery');

module.exports = can.Map.extend({
    showFormattingReqsModal : function() {
        $('#formatting-requirements-modal').modal('show');
    }
});
