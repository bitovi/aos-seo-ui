var can = require('can');

require('can/view/stache/stache');
require('seo-ui/components/user-menu/user-menu');
require('bootstrap/js/dropdown');

var template = require('./header.stache!');
var ViewModel = require('./header.viewmodel');
var saveChangesModal = require('seo-ui/utils/unsaved-changes-dialog');
module.exports = can.Component.extend({
    tag: 'seo-header',
    template: template,
    viewModel: ViewModel,
    events: {
        '.check-saved-state-js click': function ($el, ev) {
            var self = this;
            var isUnsaved = this.viewModel.attr('state.unsaved');
            if (isUnsaved) {
                saveChangesModal($el, ev, function go() {
                    self.viewModel.state.removeAttr('unsaved');
                    $el.trigger('click');
                });
            }
        }
    }
});
