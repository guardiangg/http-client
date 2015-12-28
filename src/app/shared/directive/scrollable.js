var app = angular.module('app');

app.directive('scrollable', [
    '$timeout',

    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var $scroller, newInstance = true;

                var shadowL = angular.element('<div class="scrollable-shadow l animated"></div>');
                var shadowR = angular.element('<div class="scrollable-shadow r animated"></div>');
                shadowL.css('left', element.css('margin-left'));

                shadowL.insertAfter(element);
                shadowR.insertAfter(element);

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

                var init = function() {
                    // Reset styles
                    element.removeClass('no-scroll');
                    shadowL.css('left', element.css('margin-left'));

                    if (!element.hasClass('scrollable')) {
                        element.addClass('scrollable')
                    }

                    if ($scroller) {
                        $scroller.kinetic('detach');
                        $scroller.data('kinetic', false);
                    }

                    var viewport = element.width();
                    var leftPos = element.scrollLeft();

                    // Scroll horizontally to the active column on load (if it's out of view)
                    var activeColumn = $('.active-sort');
                    if (activeColumn.length > 0 && newInstance) {
                        var columnOffset = activeColumn[0].offsetLeft;
                        var diff = columnOffset - leftPos;

                        if (diff > viewport) {
                            element[0].scrollLeft += (diff - viewport) + activeColumn.outerWidth();
                            newInstance = false;
                        }
                    }

                    if (leftPos === 0) {
                        shadowL.removeClass('fadeIn').addClass('fadeOut');
                    } else {
                        shadowL.removeClass('fadeOut').addClass('fadeIn');
                    }

                    if ((element.width() + leftPos) < element[0].scrollWidth) {
                        shadowR.removeClass('fadeOut').addClass('fadeIn');
                    } else {
                        shadowR.removeClass('fadeIn').addClass('fadeOut');

                        // If the scroll position is 0 here, we can assume the table is not scrollable
                        // Add a class so we can hack out the cursor that indicates the table is scrollable
                        if (leftPos == 0) {
                            element.addClass('no-scroll');
                        }
                    }

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

                var delayedObserver;

                scope.$on('scrollable-table.init', function() {
                    if (delayedObserver) {
                        $timeout.cancel(delayedObserver);
                    }

                    delayedObserver = $timeout(init, 500);
                });

                window.onresize = function(event) {
                    if (delayedObserver) {
                        $timeout.cancel(delayedObserver);
                    }

                    delayedObserver = $timeout(init, 750);
                }
            }
        };
    }
]);
