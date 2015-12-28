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
            templateUrl: 'shared/directive/talent-grid/talent-grid.html'
        };
    }
]);
