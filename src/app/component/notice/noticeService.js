var app = angular.module('app');

app.service('notice', [
    '$q',
    '$http',
    '$localStorage',
    '$templateCache',

    function ($q, $http, $localStorage, $templateCache) {
        return new function() {
            this.hide = function(id) {
                var hiddenNotices = $localStorage.hiddenNotices || [];
                hiddenNotices.indexOf(id) == -1 && hiddenNotices.push(id);

                $localStorage.hiddenNotices = hiddenNotices;

                $('[data-ggg-notice="' + id + '"]').fadeOut();
            };

            this.getActive = function() {
                var d = $q.defer();
                var hiddenNotices = $localStorage.hiddenNotices || [];

                // TODO: Temporary location, to be replaced with an api endpoint when the backend is ready
                $http.get('/notices.json').then(function(response) {
                    var notices = response.data.data.sort(function(a, b) {
                        return b.priority - a.priority;
                    });

                    notices = _.filter(notices, function(notice) {
                        return hiddenNotices.indexOf(notice.uniqueId) == -1 && moment(notice.expires).unix() > moment().unix();
                    });

                    d.resolve(notices);
                }, function(err) {
                    d.reject(err);
                });

                return d.promise;
            }
        };
    }
]);
