var app = angular.module('app');

app.controller('itemCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$location',
    '$stateParams',
    'gamedata',
    'consts',

    function ($rootScope, $scope, $state, $location, $stateParams, gamedata, consts) {
        $scope.filters = {};
        $scope.typeSlug = $stateParams.type;
        $scope.type = null;
        $scope.subTypeSlug = $stateParams.subType;
        $scope.subType = consts.itemSubTypeToId($scope.subTypeSlug);
        $scope.page = $stateParams.page;

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

        gamedata
            .getPage('items', $scope.page, filters)
            .then(function(data) {
                $scope.results = data;
                $scope.columns = [];

                _.each($scope.results.data, function(item) {
                    _.each(item.stats, function(stat) {
                        if (!_.find($scope.columns, function(col) { return col.name === stat.name })) {
                            $scope.columns.push({ name: stat.name })
                        }
                    });
                });

                $scope.$emit('scrollable-table.init', true);
            });

        $scope.$watch('filters', function(value) {
            $location.search(value);
        });
    }
]);
