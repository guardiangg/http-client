var app = angular.module('app');

app.directive('advert', [
    '$timeout',
    '$interval',

    function($timeout, $interval) {
        var refreshInterval = null;

        return {
            restrict: 'E',
            scope: {
                sizes: '@'
            },
            link: function(scope, element) {
                if (!window.MonkeyBroker) {
                    return;
                }

                var sizes = scope.sizes.split(','),
                    validSizes = [
                        "970x250", "970x90", "728x90", "Unstacked 300x250",            // Horizontal
                        "300x600", "300x250", "160x600", "120x600", "Stacked 300x250", // Vertical
                        "320x50",                                                      // Mobile
                    ],
                    sizeToWidth = {
                        "320x50": 320,
                        "970x250": 970,
                        "970x90": 970,
                        "728x90": 728,
                        "Unstacked 300x250": 600,
                        "300x600": 300,
                        "300x250": 300,
                        "160x600": 160,
                        "120x600": 120,
                        "Stacked 300x250": 300
                    };

                sizes = _.filter(sizes, function(size) {
                    return validSizes.indexOf(size) > -1;
                });

                if (sizes.length == 0) {
                    return console.error('Attempted to load an ad slot with no valid dimensions');
                }

                var maxWidth = 0;
                _.each(sizes, function(size) {
                    if (sizeToWidth[size] && maxWidth < sizeToWidth[size]) {
                        maxWidth = sizeToWidth[size];
                    }
                });

                var loadAd = function() {
                    var ele = angular.element('<div></div>');
                    element.html(ele);

                    MonkeyBroker.adPlacement({
                        sizes: sizes,
                        el: ele[0]
                    });
                };

                var isTooSmall = function() {
                    var w = 0;
                    if (element.parent().is(':visible')) {
                        w = element.parent().outerWidth();
                    } else {
                        element.parent().show();
                        w = element.parent().outerWidth();
                        element.parent().hide();
                    }

                    return maxWidth /*+ 10*/ > w;
                };

                var isHidden = true;
                var resize = function() {
                    if (isTooSmall() && !isHidden) {
                        isHidden = true;
                        element.parent().hide();
                    } else if (!isTooSmall() && isHidden) {
                        isHidden = false;
                        element.parent().show();
                        loadAd();
                    }
                };

                if (!isTooSmall()) {
                    loadAd();
                    isHidden = false;
                } else {
                    isHidden = true;
                    element.parent().hide();
                }

                $(window).resize(resize);
                $timeout(resize);

                // Hack to ensure ads behave
                if (!refreshInterval) {
                    refreshInterval = $interval(resize, 1500);

                    scope.$on('destroy', function () {
                        $interval.cancel(refreshInterval);
                        refreshInterval = null;
                    });
                }
            }
        };
    }
]);
