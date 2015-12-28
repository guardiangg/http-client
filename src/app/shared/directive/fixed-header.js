var app = angular.module('app');

app.directive('fixedHeader', [
    function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var isFixed = false;

                $(window).bind('scroll', function() {
                    var offset = $(this).scrollTop();
                    var tableOffset = element.offset().top;

                    if (offset >= tableOffset) {
                        element.find('thead').css({
                            position: 'absolute',
                            top: (offset - tableOffset)
                        });

                        if (!isFixed) {
                            isFixed = true;
                            element.find('tr.spacer').css({
                                display: 'table-row'
                            });
                        }
                    } else if (offset < tableOffset && isFixed) {
                        isFixed = false;

                        element.find('thead').css({
                            position: 'relative',
                            top: 'auto'
                        });

                        element.find('tr.spacer').css({
                            display: 'none'
                        });
                    }
                });
            }
        };
    }
]);
