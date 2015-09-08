$(document).ready(function(){
    $('#inputSearch').focus(function () {
        $(this).css("border-right", "0 !important");
        $('#addonSearchInput').css({'border':'1px solid #4285f4', 'border-left': '0'});
    });

    $('#inputSearch').blur(function () {
        $('#addonSearchInput').css({'border':'1px solid #b9b9b9', 'border-left': '0'});
    });
});