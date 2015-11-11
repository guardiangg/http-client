var app = angular.module('app');

app.service('util', [
    'config',

    function (config) {
        return new function () {
            var urlRegex = /{(\w+)}/;

            this.buildApiUrl = function (endpoint, tokens, params) {
                return this.buildUrl(config.api + '/' + endpoint, tokens) + this.encodeQueryParams(params);
            };

            this.encodeQueryParams = function(params) {
                var queryParams = '';

                if (params) {
                    queryParams = '?';
                    for (var prop in params) {
                        if (!params.hasOwnProperty(prop)) {
                            return;
                        }
                        queryParams += encodeURIComponent(prop) + '=' + encodeURIComponent(params[prop]) + '&';
                    }
                    queryParams = queryParams.substring(0, queryParams.length - 1);
                }

                return queryParams;
            };

            this.buildUrl = function (url, tokens) {
                var match;

                while (match = urlRegex.exec(url)) {
                    if (null == tokens[match[1]]) {
                        throw 'Missing "' + match[1] + '" for ' + url;
                    }
                    url = url.replace(match[0], tokens[match[1]]);
                }

                return url;
            };
        };
    }
]);
