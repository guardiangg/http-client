var app = angular.module('app');

app.directive('toggle', function(){
    return {
        restrict: 'A',
        scope: {
            tooltip: '@'
        },

        link: function(scope, element, attrs){
            if (attrs.toggle=="tooltip"){
                $(element).tooltip({
                    container: 'body',
                    placement: 'right',
                    animation: false,
                    title: scope.tooltip
                });
            }
            if (attrs.toggle=="popover"){
                $(element).popover();
            }
        }
    };
});
