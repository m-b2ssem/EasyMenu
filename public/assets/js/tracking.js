window.onload = function() {
    var utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    var currentUrlParams = new URLSearchParams(window.location.search);

    // Check if any UTM parameters are present in the current URL
    var hasUtmParams = utmParams.some(param => currentUrlParams.has(param));

    // If no UTM parameters are present, set utm_source to 'website'
    if (!hasUtmParams) {
        currentUrlParams.set('utm_source', 'website');
    }

    var utmString = "?" + utmParams
        .filter(param => currentUrlParams.has(param))
        .map(param => param + "=" + currentUrlParams.get(param))
        .join("&");

    document.querySelectorAll('a[href]').forEach(function(anchor) {
        var href = new URL(anchor.href, window.location.origin);
        if (href.origin === window.location.origin && href.pathname !== window.location.pathname) {
            href.search += (href.search ? "&" : "") + utmString.substring(1);
            anchor.href = href.toString();
        }
    });

    var logoAnchor = document.querySelector('.logo');
    if (logoAnchor) {
        var newUrl = 'https://easymenus.eu' + utmString;
        logoAnchor.setAttribute('href', newUrl);
    }
}