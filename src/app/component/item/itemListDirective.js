var app = angular.module('app');

app.directive('itemList', [
    '$timeout',
    'itemListFactory',

    function ($timeout, itemListFactory) {
        return {
            restrict: 'A',
            scope: {
                itemList: '='
            },
            templateUrl: 'component/item/item-list-directive.html',
            controller: [
                '$scope',

                function ($scope) {
                    var listService = new itemListFactory();
                    $scope.listService = listService;

                    listService.init();

                    listService.registerObserverCallback(function() {
                        $scope.statColumns = listService.statColumns;
                        $scope.typeLists = listService.typeLists;
                        $scope.isEmblem = listService.categories.indexOf(19) > -1;

                        _.each([1, 19, 20, 41, 43], function(cat) {
                            if (listService.categories.indexOf(cat) > -1) {
                                $scope.hideDescription = true;
                            }
                        });

                        $scope.filteredData = listService.filteredData;
                    });

                    $scope.$watch('itemList', function(current) {
                        if (typeof current != 'undefined') {
                            listService.load(current);
                            listService.resetFilters();
                        }

                        $timeout(function() {
                            $scope.$emit('scrollable-table.init', true);
                            window.gggTips.run();
                        });
                    });
                }
            ]
        }
    }
]);
