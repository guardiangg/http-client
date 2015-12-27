(function() {
    chrome.storage.sync.get({
    }, function() {
        var options = document.createElement('script');
        options.type = 'text/javascript';
        options.innerHTML = 'var gggTipOptions = {};';
        document.getElementsByTagName('head')[0].appendChild(options);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://guardian.gg/asset/js/tooltip.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    });
})();