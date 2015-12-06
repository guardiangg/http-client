(function() {
    Opentip.styles.ggg = {
        stem: false,
        background: '#000',
        borderRadius: 0,
        borderWidth: 0,
        className: 'ggg'
    };
    Opentip.defaultStyle = 'ggg';

    var opts = _.extend({
        debug: false,
        rename: true
    }, typeof ggTips === 'undefined' ? {} : ggTips);


    // inject stylesheet into HEAD
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = (opts.debug ? '' : 'https://guardian.gg') + '/asset/css/tooltip.css';

    head.appendChild(link);

    var fetch = function(url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                callback(JSON.parse(xhttp.responseText));
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    };

    var links  = document.getElementsByTagName("a");
    var nodes  = {};
    var cache  = {};

    _.each(links, function(link) {
        var match;

        if (!(match = link.href.match(/^https?:\/\/guardian.gg\/\w+\/items\/(\d+)/))) {
            return;
        }

        if (!nodes[match[1]]) {
            nodes[match[1]] = [];
        }

        nodes[match[1]].push(link);
    });

    var ids = _.chain(nodes)
        .keys()
        .uniq()
        .filter(function(hash) {
            return !cache[hash];
        })
        .value();

    if (ids.length == 0) {
        return;
    }

    var url = 'http://api.guardian.gg/tooltips/items/' + ids.join(';');
    fetch(url, function(result) {
        if (result.constructor !== Array) {
            return;
        }

        _.each(result, function(row) {
            cache[row.hash] = {
                html: window["JST"]["item.html"](row),
                json: row
            };
        });

        _.each(nodes, function(children, hash) {
            if (!cache[hash]) {
                return;
            }

            _.each(children, function(node) {
                var tip = new Opentip(node, cache[hash].html, {
                    delay: 0,
                    hideDelay: 0,
                    showEffect: null,
                    hideEffect: null,
                    showOn: null,
                    target: true,
                    tipJoint: 'bottom'
                });

                node.addEventListener('mouseover', function() {
                    tip.show();
                });

                var nodeOpts = {};

                _.each(node.attributes, function(attr) {
                    var match;

                    if (!(match = attr.nodeName.match(/^data-gg-([\w-]+)/))) {
                        return;
                    }

                    nodeOpts[match[1]] = attr.nodeValue;
                });

                nodeOpts = _.extend({}, opts, nodeOpts);

                if (nodeOpts.rename === true || nodeOpts.rename === 'true') {
                    node.innerHTML = cache[hash].json.name;
                }
            })
        });
    });
})();