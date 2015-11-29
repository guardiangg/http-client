var app = angular.module('app');

app.directive('pagination', [
    function() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                name: '=',
                callback: '='
            },
            link: function(scope, element, attrs) {
                scope.load = function(page) {
                    if (scope.callback) {
                        scope.callback(page);
                    } else {
                        console.log('No callback passed, offset: ' + page);
                    }
                };

                var init = function() {
                    scope.maxPages = Math.ceil(scope.data.totalItems / scope.data.pageCount) - 1;
                };

                scope.$watch('data', function(d) {
                    d && init();
                }, true);
            },
            templateUrl: 'directive/pagination.html'
        };
    }
]);
