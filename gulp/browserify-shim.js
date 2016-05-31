var shims = {
    "../node_modules/jasmine-jquery/jasmine-jquery.js": {
        "depends": {
            "jquery": "jQuery",
            "../node_modules/karma-jasmine/jasmine.js": "jasmine"
        }
    }
};

module.exports = shims;
