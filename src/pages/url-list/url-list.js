require('can/map/define/define');
require('can/view/stache/stache');
require('@apple/pui/components/popover/popover');
require('seo-ui/components/export-urls/export-urls');
require('seo-ui/components/list-page/list-page');

var can = require('can');
var template = require('./url-list.stache!');
var ViewModel = require('./url-list.viewmodel');

module.exports = can.Component.extend({
    tag: 'seo-url-list',
    template: template,
    viewModel: ViewModel,
    events : {
        /**
         * @function api.pages.seo-url-list.'.toggleSelect click'
         * @description Callback function invoked when selectAll is selected.
         * @param $el The clicked element.
         * @param evt The event object.
         */

        '.selectUrl .toggleSelect click': function ($el, evt) {
            var $rowItems = $('.row-select');
            var itemLength = $rowItems.length;
            if($el[0].checked) {
                $rowItems.each(function (index, item) {
                    item.checked = true;
                });
                this.viewModel.attr("selectUrlCount",this.viewModel.attr("count"));
            } else {
                $rowItems.each(function (index, item) {
                    item.checked = false;
                });
                this.viewModel.attr("selectUrlCount",0);
            }

        },

        /**
         * @function api.pages.seo-url-list.'.row-select click'
         * @description Callback function invoked specific row item selected.
         * @param $el The clicked element.
         * @param evt The event object.
         */
        '.row-select click': function ($el, evt) {
            var header = $('.toggleSelect');
            var $rowItems = $('.row-select');
            if (!$el[0].checked) {
               header.prop('checked', false);
               if(  this.viewModel.attr("selectUrlCount")!==0){
                   this.viewModel.attr("selectUrlCount",( this.viewModel.attr("selectUrlCount")-1));
               }
            } else {
                var vm =  this.viewModel;
                $rowItems.each(function (index, item) {
                    if (item.checked) {
                        header.prop('checked', true);
                    } else {
                        header.prop('checked', false);
                        return false;
                    }
                })
                vm.attr("selectUrlCount",( vm.attr("selectUrlCount")+1));
            }
        }
    }
});
