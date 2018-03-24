/**
 * @module {function} utils/unsortableColumnsList Get the list of columns
 * @parent utils
 *
 * This function returns the array of columns which are non sortable or hidden.
 e.g. ['content','tag']
 *
 */

module.exports = function (columns) {
    var unsortableColumnsList = [];

    columns.forEach(function (column) {
        if (column.hasOwnProperty('sorting') || column.hasOwnProperty('isHidden')) {
            unsortableColumnsList.push(column.attr('key'));
        }
    });

    return unsortableColumnsList;
};
