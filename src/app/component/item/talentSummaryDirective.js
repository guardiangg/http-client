var app = angular.module('app');

app.directive('talentSummary', [
    '$templateCache',
    '$compile',
    '$timeout',
    'gettextCatalog',

    function($templateCache, $compile, $timeout, gettextCatalog) {
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

                    var count = 1;
                    for (var c = minCol; c < maxCol; c++) {
                        element.append(
                            '<h5 class="breakdown-heading">' +
                            gettextCatalog.getString('Column') +
                            ' #' + (count) +
                            '</h5>'
                        );

                        var colElement = angular.element('<ul class="breakdown-col"></ul>');

                        for (var r = minRow; r < maxRow; r++) {
                            var perk = _.filter(scope.perks, function(p) {
                                return p.row == r && p.col == c;
                            });

                            if (perk.length == 0) {
                                continue;
                            }

                            if (perk.length == 1) {
                                colElement.append(renderPerk(perk[0]));
                            } else {
                                var randomEle = renderRandom();
                                var perkGroup = angular.element('<ul></ul>');

                                _.each(perk, function(p) {
                                    perkGroup.append(renderPerk(p));
                                });

                                randomEle.append(perkGroup);
                                colElement.append(randomEle);
                            }
                        }

                        element.append(colElement);
                        count++;
                    }
                };

                var renderRandom = function(perk) {
                    var ele = angular.element('<li></li>');
                    var perkEle = angular.element('<div class="breakdown-perk"></div>');
                    var perkInfo = angular.element('<div class="breakdown-perk-info"></div>');
                    var perkIcon = angular.element('<div class="breakdown-perk-icon"></div>');
                    perkIcon.css('background-image', 'url(/asset/image/item/dice.png)');

                    perkEle.append(perkIcon);
                    perkInfo.append('<strong>' + gettextCatalog.getString('Random') + '</strong>' + gettextCatalog.getString('One of these perks is randomly selected for this node'));
                    perkEle.append(perkInfo);

                    ele.append(perkEle);

                    return ele;
                };

                var renderPerk = function(perk) {
                    var ele = angular.element('<li></li>');
                    var perkEle = angular.element('<div class="breakdown-perk"></div>');
                    var perkInfo = angular.element('<div class="breakdown-perk-info"></div>');
                    var perkIcon = angular.element('<div class="breakdown-perk-icon"></div>');
                    perkIcon.css('background-image', 'url(https://bungie.net/' + perk.icon + ')');

                    perkEle.append(perkIcon);
                    perkInfo.append('<strong>' + perk.name + '</strong>' + perk.description);
                    perkEle.append(perkInfo);

                    ele.append(perkEle);

                    return ele;
                };

                scope.$watch('perks', function(perks) {
                    perks && init();
                });
            }
        };
    }
]);
