var app = angular.module('app');

app.directive('infiniteScroll', [
    '$window',

    function($window) {
        return {
            restrict: 'A',
            scope: {
                infiniteScroll: '='
            },

            link: function(scope, element) {
                var handler = function() {
                    if ($window.pageYOffset + $window.innerHeight >= element.height() + element.offset().top - 100)  {
                        scope.infiniteScroll();
                    }
                };

                $window.addEventListener('scroll', handler);

                scope.$on('$destroy', function() {
                    $window.removeEventListener('scroll', handler);
                });
            }
        };
    }
]);
