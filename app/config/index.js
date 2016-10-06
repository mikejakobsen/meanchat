(function () {
    'use strict';

    var init = function () {
        // For at skjule tokens til twitter og facebook fra Github
        return require('./config.json');
    };

    module.exports = init();
}());
