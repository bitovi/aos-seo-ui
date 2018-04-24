var $ = require('jquery');
var canViewModel = require('can-view-model');

module.exports = function ($el, ev, leave) {
    ev.preventDefault();
    canViewModel($('pui-confirm.global-confirm')).showDialog({
        title: 'Unsaved Changes',
        type: 'warning',
        text: 'Leaving the page will cause you to lose your unsaved changes. Would you like to continue?',
        buttons: [
            {
                text: 'Leave this page',
                action: 'cancel'
            },
            {
                text: 'Stay on page',
                action: 'confirm'
            }]
    }).then(function (dialog) {
        dialog.close();
    }, function (dialog) {
        leave();
        dialog.close();
    });
};
