var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var profile = getUrlParameter('profile');

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

$('#like').on("click",function(){
    if ($(this).attr('data-type') == 'like'){
        $(this).text('dislike');
        $(this).attr('data-type', 'dislike');
    }
        
    else{
        $(this).text('like');
        $(this).attr('data-type', 'like');
    }
    
    $.post(baseUrl + '/public/user/like', {
        profile: profile,
        type: $(this).attr('data-type')
    });
})()