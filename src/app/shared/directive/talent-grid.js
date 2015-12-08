var app = angular.module('app');

app.directive('talentGrid', [
    function() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                name: '=',
                callback: '='
            },
            link: function(scope, element, attrs) {
            },
            templateUrl: 'directive/talent-grid.html'
        };
    }
]);
