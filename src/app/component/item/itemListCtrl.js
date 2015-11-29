var app = angular.module('app');

app.controller('itemListCtrl', [
    '$scope',
    '$stateParams',
    'util',
    'itemListFactory',

    function ($scope, $stateParams, util, itemListFactory) {
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

            $scope.columns = listService.columns;
            $scope.filters = listService.filters;
            $scope.typeLists = listService.typeLists;

            $scope.$emit('scrollable-table.init', true);

            $scope.listLoaded = true;
        });

        listService.setPrimaryType($stateParams.primary);
        listService.setSecondaryType($stateParams.secondary);
        listService.setTertiaryType($stateParams.tertiary);

        listService.load();

        $scope.listLoaded = false;
        $scope.filters = listService.filters;
        $scope.listService = listService;
        $scope.slugify = util.slugify;
    }
]);
