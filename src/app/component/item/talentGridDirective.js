var app = angular.module('app');

app.directive('talentGrid', [
    '$timeout',

    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                perks: '='
            },

            link: function(scope, element) {
                var init = function() {
                    var maxRow = 0;
                    var maxCol = 0;
                    element.html('');

                    _.each(scope.perks, function(perk) {
                        if (perk.row + 1 > maxRow) {
                            maxRow = perk.row + 1;
                        }

                        if (perk.col + 1 > maxCol) {
                            maxCol = perk.col + 1;
                        }
                    });

                    for (var r = 0; r < maxRow; r++) {
                        var rowElement = angular.element('<div class="talent-row"></div>');

                        for (var c = 0; c < maxCol; c++) {
                            var perk = _.find(scope.perks, function(p) {
                                return p.row == r && p.col == c;
                            });

                            if (!perk) {
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

                    var link = angular.element('<a href="javascript:;"></a>');
                    link.css('background-image', 'url(//bungie.net/' + perk.icon + ')');

                    ele.append(link);
                    rowElement.append(ele);
                };

                scope.$watch('perks', function(perks) {
                    perks && init();
                });
            }
        };
    }
]);
