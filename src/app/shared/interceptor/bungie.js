var app = angular.module('app');

app.factory('bungieInterceptor', [
    '$q',
    '$rootScope',

    function($q, $rootScope) {
        return {
            response: function (response) {
                if (response.config.url.indexOf('proxy.guardian.gg') > -1) {
                    if (response.data.ErrorCode && response.data.ErrorCode != 1) {
                        $rootScope.apiError = '[' + response.data.ErrorCode + '] ' + response.data.ErrorStatus;
                        return $q.reject(response);
                    }
                }

                return $q.resolve(response);
            },

            responseError: function (rejection) {
                if (rejection.config.url.indexOf('proxy.guardian.gg') > -1) {
                    $rootScope.apiError = 'UnknownProxyError';
                }

                return $q.reject(rejection);
            }
        }
    }
]);
