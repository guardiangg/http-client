var app = angular.module('app');

app.controller('itemListCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$timeout',
    'util',
    'consts',
    'itemListFactory',

    function ($rootScope, $scope, $stateParams, $timeout, util, consts, itemListFactory) {
        var listService = new itemListFactory();

        listService.registerObserverCallback(function() {
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

            $scope.statColumns = listService.statColumns;
            $scope.filters = listService.filters;
            $scope.typeLists = listService.typeLists;
            $scope.isEmblem = listService.categories.indexOf(19) > -1;

            _.each([1, 19, 20, 41, 43], function(cat) {
                if (listService.categories.indexOf(cat) > -1) {
                    $scope.hideDescription = true;
                }
            });

            $scope.$emit('scrollable-table.init', true);

            $scope.listLoaded = true;
            $rootScope.title = listService.seoTitle;

            $timeout(function() {
                window.gggTips.run();
            });
        });

        listService.setPrimaryType($stateParams.primary);
        listService.setSecondaryType($stateParams.secondary);
        listService.setTertiaryType($stateParams.tertiary);
        $rootScope.title = listService.seoTitle;

        listService.load();

        $scope.listLoaded = false;
        $scope.slugify = util.slugify;
        $scope.filters = listService.filters;
        $scope.listService = listService;
        $scope.sources = consts.reward_sources;
        $scope.tiers = consts.item_tiers;
    }
]);
