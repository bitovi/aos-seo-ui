/**
 * @parent components
 * @tag documentation
 * @module {constructor} components/Nemo-User-Menu Nemo-User-Menu
 *
 * Component creates User Menu from provided menu content.
 *
 * Upon initializing, the component will initialize the popover and assign
 * the content to the popover's trigger
 *
 * @signature `<nemo-user-menu>`
 *
 * ``` javascript
 * <nemo-user-menu userData="{user}">
 *  <p><a href="#" class="link-logout">Logout</a></p>
 * </nemo-user-menu>
 * ```
 *
 * @param {{}} user-data current user's data.
 */
var can = require('can');
var ViewModel = require('./viewmodel.js');
require('can/view/stache/stache');
require('bootstrap/js/dropdown');
var template = require('./user-menu.stache');

can.Component.extend({
    tag: 'app-user-menu',
    template: template,
    scope: ViewModel
});

module.exports = ViewModel;
