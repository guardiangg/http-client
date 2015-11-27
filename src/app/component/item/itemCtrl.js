var app = angular.module('app');

app.controller('itemCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$location',
    '$stateParams',
    'gamedata',
    'consts',
    'util',

    function ($rootScope, $scope, $state, $location, $stateParams, gamedata, consts, util) {
        var rawData,
            perPage = 25;
        $scope.filters = {};
        $scope.page = 0;

        var itemTypeNotFound = function() {
            $scope.filterError = true;
        };

        var categories = [],
            primaryType,
            secondaryType,
            tertiaryType,
            listType;

        $scope.typeLists = {
            primary: [],
            secondary: false,
            tertiary: false
        };

        $scope.typeSlugs = {
            primary: $stateParams.primary,
            secondary: $stateParams.secondary,
            tertiary: $stateParams.tertiary
        };

        $scope.typeLists.primary = consts.item_category_list;
        primaryType = consts.getItemCategoryBySlug($stateParams.primary);
        if (!primaryType) {
            return itemTypeNotFound();
        } else {
            categories.push(primaryType.category);
            listType = primaryType.list_type;
            $scope.typeLists.secondary = primaryType.children;
        }

        if ($stateParams.secondary) {
            secondaryType = consts.getItemCategoryBySlug($stateParams.secondary, primaryType.children);
            if (!secondaryType) {
                return itemTypeNotFound();
            } else {
                if (secondaryType.ignore_parent_category) {
                    categories = [secondaryType.category];
                } else {
                    categories.push(secondaryType.category);
                }
                listType = secondaryType.list_type;
                $scope.typeLists.tertiary = secondaryType.children;
            }
        }

        if ($stateParams.tertiary) {
            tertiaryType = consts.getItemCategoryBySlug($stateParams.tertiary, secondaryType.children);
            if (!tertiaryType) {
                return itemTypeNotFound();
            } else {
                if (tertiaryType.ignore_parent_category) {
                    categories = [tertiaryType.category];
                } else {
                    categories.push(tertiaryType.category);
                }
                listType = tertiaryType.list_type;
            }
        }

        $scope.load = function() {
            var options = {
                primary: $scope.typeSlugs.primary,
                secondary: null,
                tertiary: null
            };

            if ($scope.typeSlugs.secondary) {
                options.secondary = $scope.typeSlugs.secondary;
            };

            if ($scope.typeSlugs.tertiary) {
                options.tertiary = $scope.typeSlugs.tertiary;
            };

            var href = $state.href('app.items', options);
            $location.url(href);
        };

        $scope.resetFilter = {
            secondary: function() {
                $scope.typeSlugs.secondary = null;
                $scope.typeSlugs.tertiary = null;
            },
            tertiary: function() {
                $scope.typeSlugs.tertiary = null;
            }
        };

        var filters = {
            category: categories.join(',')
        };

        $scope.list = consts.item_list_types[listType];
        $scope.columns = [];
        $scope.slugify = util.slugify;

        $scope.page = function(p) {
            $scope.results.data = getFilteredData().slice(p * perPage, (p * perPage) + perPage);
        };

        var getFilteredData = function() {
            return _.sortBy(rawData, 'name');
        };

        gamedata
            .getPage('items', $scope.page, filters)
            .then(function(data) {
                rawData = data.data;

                // Re-map the stats so the object key is the stat hash, this makes it easier to display the
                // appropriate stat under the stat column, which is not in the same order as the item stat array
                _.each(rawData, function(item) {
                    item._stats = {};

                    _.each(item.stats, function(stat) {
                        var exists = _.find($scope.columns, function(e) {
                            return e.hash == stat.hash;
                        });

                        // If the stat exists in the list view template, add the column
                        if (!exists && _.contains($scope.list.stat_columns, stat.hash)) {
                            $scope.columns.push(stat);
                        }

                        item._stats[stat.hash] = stat;
                    });
                });

                // Give the client some guidance on the intended order of the stat columns
                _.each($scope.list.stat_columns, function(col, idx) {
                    var exists = _.find($scope.columns, function(e) {
                        return e.hash == col;
                    });

                    if (exists) {
                        exists.index = idx;
                    }
                });

                var items = getFilteredData().slice(0, perPage);

                $scope.results = {
                    page: 0,
                    data: items,
                    pageCount: perPage,
                    totalItems: rawData.length
                };

                $scope.columns = _.sortBy($scope.columns, 'index');

                $scope.$emit('scrollable-table.init', true);
            });

        $scope.$watch('filters', function(value) {
            $location.search(value);
        });
    }
]);
