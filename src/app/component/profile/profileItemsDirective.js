var app = angular.module('app');

app.directive('profileItems', [
    'consts',

    function (consts) {
        return {
            restrict: 'E',
            scope: {
                isExotic: '=',
                items: '=',
                definitions: '=',
                slots: '@'
            },
            templateUrl: 'component/profile/profile-items.html',

            link: function (scope, element) {
                var init = function() {
                    scope.profileItems = [];

                    _.each(scope.slots.split(','), function(slot) {
                        var item = _.find(scope.items, function(i) {
                            return i.bucketHash == consts.buckets[slot];
                        });

                        if (!item) {
                            return;
                        }

                        item = item.items[0];
                        item.definition = scope.definitions.items[item.itemHash];

                        if (!item.definition) {
                            return;
                        }

                        if (scope.isExotic && item.definition.tierType != 6) {
                            return;
                        }

                        item.perks = getPerks(item);
                        if (slot == 'subclass') {
                            item.perks = getSubclassPerks(item);
                        }

                        scope.profileItems.push(item);
                    });
                };

                var getPerks = function(item) {
                    var perks = [];

                    var talentGrid = scope.definitions.talentGrids[item.definition.talentGridHash];

                    _.each(talentGrid.nodes, function(node, nodeIdx) {
                        _.each(node.steps, function(step, stepIdx) {
                            _.each(step.perkHashes, function(perkHash) {
                                var perk = scope.definitions.perks[perkHash];
                                if (perk.isDisplayable == true) {
                                    var itemNode = _.find(item.nodes, function(n, idx) {
                                        return idx == nodeIdx && n.stepIndex == stepIdx;
                                    });

                                    if (itemNode && itemNode.isActivated && !itemNode.hidden) {
                                        perks.push({
                                            name: perk.displayName,
                                            icon: perk.displayIcon,
                                            description: perk.displayDescription
                                        });
                                    }
                                }
                            });
                        });
                    });

                    return perks;
                };

                var getSubclassPerks = function(item) {
                    var perks = [];
                    var talentGrid = scope.definitions.talentGrids[item.definition.talentGridHash];

                    _.each(talentGrid.nodes, function(node, nodeIdx) {
                        if (node.column == 5 || node.column == 7) { // don't care about stat perks
                            return;
                        } else if ((node.column == 2 || node.column == 3 || node.column == 4) && node.row == 0) { // don't care about first tier of super/nade/melee
                            return;
                        }

                        _.each(node.steps, function(step, stepIdx) {
                            var itemNode = _.find(item.nodes, function(n, idx) {
                                return idx == nodeIdx && n.stepIndex == stepIdx;
                            });

                            if (itemNode && itemNode.isActivated && !itemNode.hidden) {
                                perks.push({
                                    column: node.column,
                                    name: step.nodeStepName,
                                    icon: step.icon,
                                    description: step.nodeStepDescription
                                });
                            }
                        });
                    });

                    perks.sort(function(a, b) {
                        return a.column - b.column;
                    });

                    return perks;
                };

                scope.$watch('definitions', init);
            }
        }
    }
]);
