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
        rewrite: true,
        targetjoint: 'top right',
        tipjoint: 'bottom left',
        target: null,
        batch: 50
    }, typeof gggTipOptions === 'undefined' ? {} : gggTipOptions);

    if (opts.batch > 50) {
        opts.batch = 50;
    }

    window.gggTips = new function(opts) {
        var cache = {},
            linkRegex;

        var debug = function(msg) {
            opts.debug && console.debug(msg);
        };

        var gamedata = {
            buckets: {
                'subclass': 3284755031,
                'primary': 1498876634,
                'special': 2465295065,
                'heavy': 953998645,
                'head': 3448274439,
                'arm': 3551918588,
                'chest': 14239492,
                'leg': 20886954,
                'ghost': 4023194814,
                'class': 1585787867,
                'artifact': 434908299,
                'ship': 284967655,
                'vehicle': 2025709351,
                'consumable': 1469714392,
                'material': 3865314626,
                'shader': 2973005342,
                'emblem': 4274335291,
                'emote': 3054419239
            },
            skip_perk: [
                '617082448',
                '1920788875',
                '1270552711',
                '643689081', // kinetic
                '1975859941', // solar
                '472357138', // void
                '2688431654', // arc
            ],
            stats: {
                display: [
                    '4284893193', // Rate of fire
                    '2961396640', // Charge rate
                    '3614673599', // Blast radius
                    '2523465841', // Velocity
                    '2837207746', // Speed
                    '4043523819', // Impact
                    '1240592695', // Range
                    '155624089', // Stability
                    '4188031367', // Reload speed
                    '2762071195', // Efficiency
                    '209426660', // Defense
                    '925767036', // Energy
                    '360359141', // Durability
                    '3017642079', // Boost
                ],
                hidden: [
                    '3555269338', // Optics
                    '1345609583', // Aim assist
                    '2715839340', // Recoil
                    '943549884', // Equip speed
                ],
                armor: [
                    '144602215', // Intellect
                    '1735777505', // Discipline
                    '4244567218', // Strength
                ],
                magazine: '3871231066',
                attack: '368428387',
                defense: '3897883278'
            }
        };

        /**
         * Transforms an item result's data to be easier to work with in the template
         * @param {object} item
         */
        var enrichGamedata = function(item) {
            item.name = item.name || '[Unnamed Item]';

            item._primaryStats = {
                attack: _.find(item.stats, function(stat) {
                    return stat.hash.toString() === gamedata.stats.attack;
                }),
                defense: _.find(item.stats, function(stat) {
                    return stat.hash.toString() === gamedata.stats.defense;
                }),
                magazine: _.find(item.stats, function(stat) {
                    return stat.hash.toString() === gamedata.stats.magazine;
                })
            };

            item._perks = [];
            item._damageType = 0;

            _.each(item.perks, function(perk) {
                if (item._damageType > 0 && perk.damageType > 0) {
                    item._damageType = 5;
                    return;
                }

                if (perk.damageType && perk.damageType > 0) {
                    item._damageType = perk.damageType;
                }

                if (gamedata.skip_perk.indexOf(perk.stepHash.toString()) === -1) {
                    item._perks.push(perk);
                }
            });

            item._displayStats = [];

            _.each(gamedata.stats.display, function(s, idx) {
                var obj = _.find(item.stats, function(stat) {
                    return stat.hash.toString() === s;
                });

                if (!obj) {
                    return;
                }

                obj.limit = Math.max(obj.max, 100);
                obj.minPercent = Math.floor(obj.min * 100) / obj.limit;
                obj.maxPercent = Math.floor(obj.max * 100) / obj.limit;
                obj.order = idx;

                item._displayStats.push(obj);
            });

            item._displayStats = _.sortBy(item._displayStats, 'order');
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
            xhttp.open('GET', url, true);
            xhttp.send();
        };

        /**
         * Gets all the links available on the page.
         *
         * @returns {NodeList}
         */
        var links = function() {
            debug('links()');
            var result = document.getElementsByTagName('a');
            debug(result.length + ' links on page');

            if (!opts.rewrite) {
                return result;
            }

            var match;
            _.each(result, function(link) {
                var id, locale = 'en';
                if (match = link.href.match(/destinydb.com\/items\/(\d+)/i)) {
                    id = match[1];
                } else if (match = link.href.match(/db.planetdestiny.com\/items\/view\/(\d+)/i)) {
                    id = match[1];
                } else if (match = link.href.match(/www\.bungie\.net\/(\w+)\/Armory\/Detail\?type=item&item=(\d+)/i)) {
                    locale = match[1];
                    id = match[2];
                }

                if (id) {
                    link.href = 'https://guardian.gg/' + locale + '/items/' + id;
                }
            });

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

            var batch;
            var total = Math.ceil(hashes.length / opts.batch);
            var done = 0;

            while ((batch = hashes.splice(0, opts.batch)).length > 0) {
                var url = opts.apiurl + '/' + batch.join(';') + '?lc=' + opts.locale;

                fetch(url, function(result) {
                    if (result.constructor !== Array) {
                        debug('invalid result');
                        return;
                    }

                    _.each(result, function(row) {
                        enrichGamedata(row);

                        cache[row.hash] = {
                            html: window['JST']['item.html'](row),
                            json: row
                        };
                    });

                    if (++done == total && callback) {
                        debug('api requests done');

                        callback();
                    }
                });
            }
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

                if (!cache[hash]) {
                    debug('failed to find item ' + hash);
                    return;
                }

                var tip = new Opentip(element, cache[hash].html, {
                    hideDelay: 0.1,
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
         * Initializes gggTips. Ran automatically if opts.auto == true (default).
         */
        var init = function() {
            debug('this.init()');
            debug(opts);

            var tooltipCss = (opts.local ? '' : 'https://guardian.gg') + '/asset/css/tooltip.css';
            var tooltipFont = 'https://cdn.myfontastic.com/rtsPnqva2dStMpbiqqGpFi/icons.css';

            var hasCss = _.find(document.getElementsByTagName('link'), function(link) {
                return link.href == tooltipCss;
            });

            var hasFont = _.find(document.getElementsByTagName('link'), function(link) {
                return link.href == tooltipFont;
            });

            var head, link;

            if (!hasCss) {
                head = document.getElementsByTagName('head')[0];
                link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = tooltipCss;
                head.appendChild(link);
            }

            if (!hasFont) {
                head = document.getElementsByTagName('head')[0];
                link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = tooltipFont;
                head.appendChild(link);
            }

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