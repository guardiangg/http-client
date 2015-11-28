var app = angular.module('app');

app.directive('scrollable', [
    '$timeout',

    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var $scroller;

                var shadowL = angular.element('<div class="scrollable-shadow l animated"></div>');
                var shadowR = angular.element('<div class="scrollable-shadow r animated"></div>');
                shadowL.css('left', element.css('margin-left'));

                shadowL.insertAfter(element);
                shadowR.insertAfter(element);

                var init = function() {
                    if (!element.hasClass('scrollable')) {
                        element.addClass('scrollable')
                    }

                    if ($scroller) {
                        $scroller.kinetic('detach');
                        $scroller.data('kinetic', false);
                    }

                    if (element.scrollLeft() === 0) {
                        shadowL.removeClass('fadeIn').addClass('fadeOut');
                    } else {
                        shadowL.removeClass('fadeOut').addClass('fadeIn');
                    }

                    if (element.width() + element.scrollLeft() < element[0].scrollWidth) {
                        shadowR.removeClass('fadeOut').addClass('fadeIn');
                    } else {
                        shadowR.removeClass('fadeIn').addClass('fadeOut');
                    }

                    element.scroll(function(e) {
                        if (element.scrollLeft() === 0) {
                            shadowL.removeClass('fadeIn').addClass('fadeOut');
                        } else {
                            shadowL.removeClass('fadeOut').addClass('fadeIn');
                        }

                        if (element.width() + element.scrollLeft() >= element[0].scrollWidth) {
                            shadowR.removeClass('fadeIn').addClass('fadeOut');
                        } else {
                            shadowR.removeClass('fadeOut').addClass('fadeIn');
                        }
                    });

                    $scroller = element.kinetic({
                        y: false,
                        filterTarget: function(target) {
                            if (target.tagName.toLowerCase() === "th") {
                                return false;
                            } else if (target.tagName.toLowerCase() === "a" && target.href.length > 0) {
                                window.location.href = target.href;
                                return false;
                            }
                        }
                    });
                };

                scope.$on('scrollable-table.init', function() {
                    $timeout(init);
                });

                init();
            }
        };
    }
]);
