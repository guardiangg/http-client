var app = angular.module('app');

app.service('gamedata', [
    '$q',
    '$http',
    'gettextCatalog',

    function ($q, $http, catalog) {
        return new function () {
            var data = {};
            var lang = catalog.getCurrentLanguage();

            this.get = function(name) {
                return $q(function(resolve, reject) {
                    if (data[lang] && data[lang][name]) {
                        resolve(data[name]);
                        return;
                    }

                    $http
                        .get('/data/' + lang + '/' + name + '.json')
                        .then(function(result) {
                            if (!data[lang]) {
                                data[lang] = {};
                            }

                            data[name] = result.data;
                            resolve(data[name]);
                        }, function() {
                            reject();
                            throw "failed to load gamedata: " + name;
                        })
                });
            };
        };
    }
]);
