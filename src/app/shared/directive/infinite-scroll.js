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
                $window.addEventListener('scroll', function() {
                    if ($window.pageYOffset + $window.innerHeight >= element.height() + element.offset().top - 100)  {
                        scope.infiniteScroll();
                    }
                });
            }
        };
    }
]);
