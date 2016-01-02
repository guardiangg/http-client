var app = angular.module('app');

app.controller('itemListCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$timeout',
    'gamedata',
    'consts',

    function ($rootScope, $scope, $stateParams, $timeout, gamedata, consts) {
        $scope.$on('item-list.init', function(event, listService) {
            listService.setPrimaryType($stateParams.primary);
            listService.setSecondaryType($stateParams.secondary);
            listService.setTertiaryType($stateParams.tertiary);

            $scope.listService = listService;
            $scope.filters = listService.filters;
            $rootScope.title = listService.seoTitle;

            gamedata
                .getPage('items', listService.page, listService.getApiParams())
                .then(function(data) {
                    $scope.itemData = data.data;
                });
        });

        $scope.$on('item-list.notify', function(event, listService) {
            if (listService.errors.length > 0) {
                $scope.filterError = true;
                return;
            }

            $scope.results = {
                page: listService.page,
                data: listService.filteredData,
                pageCount: listService.perPage,
                totalItems: listService.filteredDataTotal
            };

            $scope.filters = listService.filters;
            $scope.typeLists = listService.typeLists;
            $scope.listLoaded = true;
            $rootScope.title = listService.seoTitle;
        });

        $scope.listLoaded = false;
        $scope.sources = consts.reward_sources;
        $scope.tiers = consts.item_tiers;
    }
]);
