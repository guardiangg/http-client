var app = angular.module('app');

app.directive('ph', [
    function() {
        return {
            restrict: 'A',
            scope: {
                ph: '='
            },

            link: function(scope, element, attrs) {
                element.attr('placeholder', scope.ph);
            }
        };
    }
]);
