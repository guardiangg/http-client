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
        $scope.typeSlug = $stateParams.type;
        $scope.type = null;
        $scope.subTypeSlug = $stateParams.subType;
        $scope.subType = consts.itemSubTypeToId($scope.subTypeSlug);
        $scope.page = $stateParams.page;

        $scope.types = consts.item_types;
        $scope.subTypes = consts.item_sub_types;

        _.each(consts.item_types, function(parent) {
            if (parent.types[$scope.typeSlug]) {
                $scope.type = parent.types[$scope.typeSlug];
            }
        });

        if (!$scope.type || !_.contains($scope.type.sub_types, $scope.subType)) {
            console.log('no route match, handle error here');
        }

        $scope.load = function(page) {
            if (page === $scope.page &&
                $scope.typeSlug === $stateParams.type &&
                $scope.subTypeSlug === $stateParams.subType
            ) {
                return;
            }

            if ($scope.subTypeSlug === $stateParams.subType && $scope.typeSlug !== $stateParams.type) {
                $scope.subTypeSlug = 'all';
            }

            var href = $state.href(
                'app.items',
                {
                    page: page,
                    type: $scope.typeSlug,
                    subType: $scope.subTypeSlug
                }
            );

            $location.url(href);
        };

        var filters = {
            bucket: $scope.type.bucket
        };

        if ($scope.subType !== 0) {
            filters.subType = $scope.subType;
        }

        $scope.list = consts.item_list_types[$scope.type.list_type];
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
