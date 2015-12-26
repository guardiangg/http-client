(function() {
    chrome.storage.sync.get({
    }, function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://guardian.gg/asset/js/tooltip.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    });
})();