var app = angular.module('app');

app.directive('talentGrid', [
    '$templateCache',
    '$compile',
    '$timeout',

    function($templateCache, $compile, $timeout) {
        return {
            restrict: 'A',
            scope: {
                perks: '='
            },

            link: function(scope, element) {
                var init = function() {
                    var minRow = 999;
                    var minCol = 999;
                    var maxRow = 0;
                    var maxCol = 0;
                    element.html('');

                    _.each(scope.perks, function(perk) {
                        if (perk.col == -1 || perk.row == -1) {
                            return;
                        }

                        if (perk.row < minRow) {
                            minRow = perk.row;
                        }

                        if (perk.row + 1 > maxRow) {
                            maxRow = perk.row + 1;
                        }

                        if (perk.col < minCol) {
                            minCol = perk.col;
                        }

                        if (perk.col + 1 > maxCol) {
                            maxCol = perk.col + 1;
                        }
                    });

                    for (var r = minRow; r < maxRow; r++) {
                        var rowElement = angular.element('<div class="talent-row"></div>');

                        for (var c = minCol; c < maxCol; c++) {
                            var perk = _.filter(scope.perks, function(p) {
                                return p.row == r && p.col == c;
                            });

                            if (perk.length == 0) {
                                addEmptyPerk(rowElement);
                            } else {
                                addPerk(rowElement, perk);
                            }
                        }

                        element.append(rowElement);
                    }
                };

                var addEmptyPerk = function(rowElement) {
                    var ele = angular.element('<div class="talent-node blank"></div>');
                    rowElement.append(ele);
                };

                var addPerk = function(rowElement, perk) {
                    var ele = angular.element('<div class="talent-node"></div>');

                    var perkScope = scope.$new(true);
                    var tooltip = angular.element('<div></div>');
                    var link = angular.element('<a href="javascript:;"></a>');
                    link.attr('data-node', perk[0].nodeIndex);

                    perkScope.perks = [];
                    perkScope.perk = {};

                    if (perk.length == 1) {
                        perkScope.perk = perk[0];
                        link.css('background-image', 'url(https://bungie.net/' + perk[0].icon + ')');
                        tooltip.html($templateCache.get('component/item/perk.html'));
                    } else {
                        perkScope.perks = perk;
                        link.css('background-image', 'url(/asset/image/item/dice.png)');
                        tooltip.html($templateCache.get('component/item/perk-random.html'));
                    }

                    ele.bind('mouseenter', function(e) {
                        $(this).addClass('active');

                        _.each(perk[0].exclusiveWith, function(nodeId) {
                            $('[data-node=' + nodeId + ']').addClass('exclusive');
                        });
                    }).bind('mouseleave', function(e) {
                        $(this).removeClass('active');

                        _.each(perk[0].exclusiveWith, function(nodeId) {
                            $('[data-node=' + nodeId + ']').removeClass('exclusive');
                        });
                    });

                    ele.append(link);
                    rowElement.append(ele);

                    $compile(tooltip.contents())(perkScope);

                    $timeout(function() {
                        var tip = new Opentip(ele[0], tooltip.html(), {
                            hideDelay: 0.01,
                            showEffect: null,
                            hideEffect: null,
                            removeElementsOnHide: true,
                            delay: 0,
                            stemLength: 0,
                            stemBase: 0,
                            containInViewport: true,
                            targetJoint: 'top right',
                            tipJoint: 'bottom left',
                            target: true,
                            fixed: true
                        });
                    });

                };

                scope.$watch('perks', function(perks) {
                    perks && init();
                });
            }
        };
    }
]);
