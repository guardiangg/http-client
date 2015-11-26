var app = angular.module('app');

app.directive('infiniteScroll', [
    '$window',
    '$timeout',

    function($window, $timeout) {
        var throttle = null;

        return {
            restrict: 'A',
            scope: {
                infiniteDisabled: '=',
                infiniteScroll: '='
            },

            link: function(scope, element, attrs) {
                window.addEventListener('scroll', function() {
                    if (scope.infiniteDisabled) {
                        return;
                    }

                    if (element.offset().top + element.height() > ($window.innerHeight + $window.pageYOffset) - $window.innerHeight) {
                        if (throttle) {
                            return;
                        }

                        throttle = $timeout(function() {
                            $timeout.cancel(throttle);
                            throttle = null;
                        }, 50);

                        scope.infiniteScroll();
                    }
                });
            }
        };
    }
]);
