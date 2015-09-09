$(document).ready(function () {
    $('#inputSearch').focus(function () {
        $(this).css("border-right", "0 !important");
        $('#addonSearchInput').css({'border': '1px solid #4285f4', 'border-left': '0'});
    });

    $('#inputSearch').blur(function () {
        $('#addonSearchInput').css({'border': '1px solid #b9b9b9', 'border-left': '0'});
    });



    //Click to google apps icon
    //Show or hide block on click
    var googleAppsBlockHide = false;
    $('#googleAppLink').click(function () {
        googleAppShow();
    });


    $(document).click(function (event) {
        if(!$(event.target).closest('#googleAppLink').length ) {
            if(!$(event.target).closest('#googleAppsBlock').length &&
                !$(event.target).closest('#googleArrowWhite').length &&  !$(event.target).closest('#googleArrow').length) {
                googleAppHide();
                hideShowMore();
                event.stopPropagation();
            }
        }
    });

    function googleAppShow() {
        if (!googleAppsBlockHide) {
            googleAppsBlockHide = true;
            $('#googleArrow').css('display', 'block');
            $('#googleArrowWhite').css('display', 'block');
            $('#googleAppsBlock').css('display', 'block');
        } else if(googleAppsBlockHide) {
            googleAppHide();
            hideShowMore();
        }
    }

    function googleAppHide() {
        if (googleAppsBlockHide) {
            $('#googleArrow').css('display', 'none');
            $('#googleArrowWhite').css('display', 'none');
            $('#googleAppsBlock').css('display', 'none');
            googleAppsBlockHide = false;
        }
    }

    //Click on buttom show more on google apps list
    $('#showMore').click(function () {
        showMore();
    });

    function showMore() {
        $('#showMore').hide();
        $('#lineSeparator').css('display', 'block');
        $('#otherServices').css('display', 'inline-block');
        $('#moreElements').removeClass('h--dis-xs_none');
    }

    function hideShowMore() {
        $('#showMore').show();
        $('#lineSeparator').css('display', 'none');
        $('#otherServices').css('display', 'none');
        $('#moreElements').addClass('h--dis-xs_none');
    }


    //show or hide settings block when click on settings link on footer
    var settingsHide = false;

    $('#settings').click(function () {
        if(!settingsHide) {
            showSettings();
        } else if(settingsHide) {
            hideSettings();
        }
    });

    function showSettings() {
        if(!settingsHide) {
            $('#settingsBlock').css('display', 'block');
            settingsHide = true;
        }
    }

    function hideSettings() {
        if(settingsHide) {
            $('#settingsBlock').css('display', 'none');
            settingsHide = false;
        }
    }

    $(document).click(function (event) {
        if(!$(event.target).closest('#settingsBlock').length && !$(event.target).closest('#settings').length) {
            hideSettings();
            event.stopPropagation();
        }
    });
});