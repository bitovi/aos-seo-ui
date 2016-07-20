var can = require('can'),
    _ = require('lodash');

module.exports = {
    /**
     * @description update the localization language list highlighting with the translations passed in to the editor
     * it is used in fragment-detail and text-asset-detail page
     */
    updateLanguageSelectList: function(languages, translations) {
        can.batch.start();
        // update hightlight
        var selectedLanguages = can.map(translations, function(translation) {
            return translation.languageCode;
        });
        languages.setSelected(selectedLanguages, true);

        // update display
        languages.each(function(language) {
            var index = _.findIndex(translations, {'languageCode': language.attr('languageCode')});
            if (index < 0) {
                language.attr('display', true);
            } else {
                language.attr('display', translations[index].attr('display'));
            }
        });
        can.batch.stop();
    }
};
