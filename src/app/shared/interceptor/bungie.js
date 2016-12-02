var app = angular.module('app');

app.factory('bungieInterceptor', [
    '$q',
    '$rootScope',

    function($q, $rootScope) {
        return {
            response: function (response) {
                if (response.config.url.indexOf('www.bungie.net') > -1) {
                    if (response.data.ErrorCode && response.data.ErrorCode != 1 && response.data.ErrorCode != 1670) {
                        $rootScope.apiError = '[' + response.data.ErrorCode + '] ' + response.data.ErrorStatus;
                        return $q.reject(response);
                    }
                }

                return $q.resolve(response);
            },

            responseError: function (rejection) {
                if (rejection.config.url.indexOf('www.bungie.net') > -1) {
                    $rootScope.apiError = 'UnknownError';
                }

                return $q.reject(rejection);
            }
        }
    }
]);
