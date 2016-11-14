var app = angular.module('app');

app.directive('advertFloating', [
    '$timeout',

    function($timeout) {
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
                        "300x600", "300x250", "160x600", "120x600", "Stacked 300x250"  // Vertical
                    ];

                sizes = _.filter(sizes, function(size) {
                    return validSizes.indexOf(size) > -1;
                });

                if (sizes.length == 0) {
                    return console.error('Attempted to load an ad slot with no valid dimensions');
                }

                var loadAd = function() {
                    if (!element.is(':visible')) {
                        return;
                    }

                    element.empty();

                    var ele = angular.element('<div></div>');
                    element.html(ele);

                    MonkeyBroker.adPlacement({
                        sizes: sizes,
                        el: ele[0]
                    });
                };

                var isHidden = false;
                var resize = function() {
                    var cw = $('#ggg-container').outerWidth();
                    var offset = $('#ggg-container').offset();
                    var view = $('#ggg-view');

                    if (cw < 1150 && !isHidden) {
                        element.hide();
                        view.css({
                                'margin-right': '0px'
                            });
                        isHidden = true;
                        return;
                    } else if (cw >= 1150 && isHidden) {
                        element.show();
                        loadAd();
                        isHidden = false;
                    } else if (isHidden) {
                        return;
                    }

                    view.css({
                        'margin-right': '315px'
                    });

                    element.css({
                        left: (offset.left + cw - 315) + 'px',
                        'width': '300px'
                    });
                };

                var sticky = function() {
                    if (isHidden) {
                        return;
                    }

                    element.css({
                        position: 'absolute',
                        top: $('#ggg-view').offset().top + 'px'
                    });
                };

                scope.$watch(function() {
                    return $('#ggg-view').offset().top;
                }, sticky);

                scope.$watch(function() {
                    return $('#ggg-container').offset().left;
                }, resize);

                scope.$watch(function() {
                    return $('#ggg-container').outerWidth();
                }, resize);

                element.ready(function() {
                    $timeout(function() {
                        sticky();
                        resize();
                        loadAd();
                    });

                    // refresh on navigation changes
                    scope.$on('advert-floating.refresh', loadAd);

                    $timeout(function() {
                        scope.$emit('chart.reflow');
                    }, 1500);
                });

                $(window).bind('resize', resize);
                $(window).scroll(sticky);
            }
        };
    }
]);
