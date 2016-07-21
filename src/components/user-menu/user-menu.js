/**
 * @parent components
 * @tag documentation
 * @module {constructor} components/Seo-User-Menu Seo-User-Menu
 *
 * Component creates User Menu from provided menu content.
 *
 * Upon initializing, the component will initialize the popover and assign
 * the content to the popover's trigger
 *
 * @signature `<seo-user-menu>`
 *
 * ``` javascript
 * <seo-user-menu userData="{user}">
 *  <p><a href="#" class="link-logout">Logout</a></p>
 * </seo-user-menu>
 * ```
 *
 * @param {{}} user-data current user's data.
 */
var can = require('can');
var ViewModel = require('./user-menu.viewmodel');
require('can/view/stache/stache');
require('bootstrap/js/dropdown');
var template = require('./user-menu.stache!');

can.Component.extend({
    tag: 'seo-user-menu',
    template: template,
    viewModel: ViewModel,
    events: {
        init: function init() {
            this.viewModel.attr('isLocalInstance', window.seo ? window.seo.configure : false);
        },
        '.dropdown-menu click': function ($el, ev) {
            ev.stopPropagation();
        }
    }
});

module.exports = ViewModel;
