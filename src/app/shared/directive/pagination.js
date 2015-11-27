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
            controller: [
                '$scope',
                function($scope) {
                    $scope.load = function(page) {
                        $scope.page = page;

                        if ($scope.callback) {
                            $scope.callback(page);
                        } else {
                            console.log('No callback passed, offset: ' + page);
                        }
                    };

                    $scope.page     = $scope.data.page;
                    $scope.maxPages = Math.ceil($scope.data.totalItems / $scope.data.pageCount) - 1;
                    $scope.total    = $scope.data.totalItems;
                }
            ],
            templateUrl: 'directive/pagination.html'
        };
    }
]);
