(function() {
    console.info('gggTips loaded, prep for pwn...');

    Opentip.styles.ggg = {
        stem: false,
        background: '#000',
        borderRadius: 0,
        borderWidth: -1,
        className: 'ggg',
        shadow: false
    };
    Opentip.defaultStyle = 'ggg';

    var opts = _.extend({
        apiurl: 'https://api.guardian.gg/tooltips/items',
        locale: 'en',
        auto: true,
        local: false,
        debug: false,
        rename: true,
        targetjoint: 'top right',
        tipjoint: 'bottom left',
        target: null
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
                callback();
                return;
            }

            var url = opts.apiurl + '/' + hashes.join(';') + '?lc=' + opts.locale;

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

                var value = attr.nodeValue;
                if (value == 'true') {
                    value = true;
                } else if (value == 'false') {
                    value = false;
                } else if (value == 'null') {
                    value = null;
                }

                options[match[1]] = value;
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
                var eOpts = optionsFromAttributes(element);
                var tip = new Opentip(element, cache[hash].html, {
                    hideDelay: 0,
                    showEffect: null,
                    hideEffect: null,
                    removeElementsOnHide: true,
                    delay: 0,
                    stemLength: 0,
                    stemBase: 0,
                    containInViewport: true,
                    target: eOpts.target,
                    targetJoint: eOpts.targetjoint,
                    tipJoint: eOpts.tipjoint,
                    group: 'ggg'
                });

                if (eOpts.rename === true) {
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