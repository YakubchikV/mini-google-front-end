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
            googleAppHide();
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
});