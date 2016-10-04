(function () {
    'use strict';

    $('.message a').click(function(){
        $('form, .social-signin, .form-line').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
}());
