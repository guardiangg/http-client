(function() {
    console.info('gggTips loaded, prep for pwn...');

    Opentip.styles.ggg = {
        stem: false,
        background: '#000',
        borderRadius: 0,
        borderWidth: 0,
        className: 'ggg'
    };
    Opentip.defaultStyle = 'ggg';

    var opts = _.extend({
        apiUrl: 'https://api.guardian.gg/tooltips/items',
        auto: true,
        local: false,
        debug: false,
        rename: true
    }, typeof gggTipOptions === 'undefined' ? {} : gggTipOptions);

    window.gggTips = new function(opts) {
        var cache = {},
            linkRegex;

        var debug = function(msg) {
            opts.debug && console.debug(msg);
        };

        /**
         * Fetches a URL via AJAX using Native JS.
         * @param url
         * @param callback
         */
        var fetch = function(url, callback) {
            debug('fetch(\'' + url + '\')');

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(JSON.parse(xhttp.responseText));
                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        };

        /**
         * Gets all the links available on the page.
         *
         * @returns {NodeList}
         */
        var links = function() {
            debug('links()');
            var result = document.getElementsByTagName("a");
            debug(result.length + ' links on page');
            return result;
        };

        /**
         * Loads the unique hashes from the API and caches the results.
         *
         * @param hashes
         * @param callback
         */
        var load = function(hashes, callback) {
            debug('load()');

            hashes = _.chain(hashes)
                .uniq()
                .filter(function(hash) {
                    return !cache[hash];
                })
                .value();

            debug(hashes.length + ' unique non-cached hashes');

            if (hashes.length == 0) {
                return;
            }

            var url = opts.apiUrl + '/' + hashes.join(';');

            fetch(url, function(result) {
                if (result.constructor !== Array) {
                    debug('invalid result');
                    return;
                }

                _.each(result, function(row) {
                    cache[row.hash] = {
                        html: window["JST"]["item.html"](row),
                        json: row
                    };
                });

                debug('cache built');

                if (callback) {
                    callback();
                }
            });
        };

        /**
         * Builds an elements options by merging the defaults with the element data-ggg-options.
         *
         * @param element
         * @returns {*}
         */
        var optionsFromAttributes = function(element) {
            var options = {};

            _.each(element.attributes, function(attr) {
                var match;

                if (!(match = attr.nodeName.match(/^data-ggg-([\w-]+)/))) {
                    return;
                }

                options[match[1]] = attr.nodeValue;
            });

            return _.extend({}, opts, options);
        };

        /**
         * Builds Opentips from the array of data passed in.
         *
         * @param data
         */
        var buildTips = function(data) {
            debug('buildTips()');

            _.each(data, function(entry) {
                var hash = entry.hash;
                var element = entry.element;

                var tip = new Opentip(element, cache[hash].html, {
                    delay: 0,
                    hideDelay: 0,
                    showEffect: null,
                    hideEffect: null,
                    showOn: null,
                    target: true,
                    tipJoint: 'bottom'
                });

                element.addEventListener('mouseover', function() {
                    tip.show();
                });

                var eOpts = optionsFromAttributes(element);

                if (eOpts.rename === true || eOpts.rename === 'true') {
                    element.innerHTML = cache[hash].json.name;
                }
            });
        };

        /**
         * Initializes gggTips. Ran automaticaly if opts.auto == true (default).
         */
        var init = function() {
            debug('this.init()');
            debug(opts);

            // inject stylesheet into HEAD
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = (opts.debug ? '' : 'https://guardian.gg') + '/asset/css/tooltip.css';

            head.appendChild(link);

            if (opts.local) {
                debug('local mode enabled');
                linkRegex = /\w+\/items\/(\d+)/;
            } else {
                linkRegex = /^https?:\/\/guardian.gg\/\w+\/items\/(\d+)/;
            }
        };

        /**
         * Builds the links found from the init() stage.
         */
        this.run = function() {
            debug('this.run()');

            var elements = [];
            var hashes = [];

            _.each(links(), function(link) {
                var match;

                if (!(match = link.href.match(linkRegex))) {
                    return;
                }

                elements.push({hash: match[1], element: link});
                hashes.push(match[1]);
            });

            debug(elements.length + ' matching elements');
            load(hashes, function() {
                buildTips(elements);
            });
        };

        init();

        if (opts.auto) {
            this.run();
        } else {
            debug('auto mode disabled, initialize at your own peril...');
        }
    }(opts);
})();