var app = angular.module('app');

app.factory('bungieInterceptor', [
    '$q',
    '$rootScope',

    function($q, $rootScope) {
        return {
            response: function (response) {
                if (response.config.url.indexOf('proxy.guardian.gg') > -1) {
                    if (response.data.ErrorCode && response.data.ErrorCode != 1) {
                        $rootScope.apiError = true;
                    }
                }

                return $q.resolve(response);
            },

            responseError: function (rejection) {
                if (rejection.config.url.indexOf('proxy.guardian.gg') > -1) {
                    $rootScope.apiError = true;
                }

                return $q.reject(rejection);
            }
        }
    }
]);
