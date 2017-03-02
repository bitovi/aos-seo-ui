/**
 * @module {can.Component} api.components.review-page Review Page
 * @parent api.components
 * @group api.components.review-page.components 0 Components
 * @author Mate Gyorffy
 *
 * @description  This component is used to create list pages.
 * @demo ../../demos/schema/demo.html
 *
 * @body
 *
 * # Use
 * ```
 * <seo-review-page
 * ></seo-review-page>
 * ```
 */

var can = require('can');

var template = require('./review-page.stache!');
var ViewModel = require('./review-page.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-review-page',
    template: template,
    viewModel: ViewModel,
    helpers: {},
    events: {}
});
