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

        gamedata
            .getPage('items', $scope.page, filters)
            .then(function(data) {
                $scope.results = data;

                _.each($scope.results.data, function(item) {
                    item._stats = {};

                    _.each(item.stats, function(stat) {
                        var exists = _.find($scope.columns, function(e) {
                            return e.hash == stat.hash;
                        });

                        if (!exists && _.contains($scope.list.stat_columns, stat.hash)) {
                            $scope.columns.push(stat);
                        }

                        item._stats[stat.hash] = stat;
                    });
                });

                _.each($scope.list.stat_columns, function(col, idx) {
                    var exists = _.find($scope.columns, function(e) {
                        return e.hash == col;
                    });

                    if (exists) {
                        exists.index = idx;
                    }
                });

                $scope.columns = _.sortBy($scope.columns, 'index');

                $scope.$emit('scrollable-table.init', true);
            });

        $scope.$watch('filters', function(value) {
            $location.search(value);
        });
    }
]);
