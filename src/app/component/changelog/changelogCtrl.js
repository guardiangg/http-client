var app = angular.module('app');

app.controller('changelogCtrl', [
    '$rootScope',
    '$scope',
    '$stateParams',
    '$timeout',
    'api',
    'gettextCatalog',

    function ($rootScope, $scope, $stateParams, $timeout, api, gettextCatalog) {
        $rootScope.title = gettextCatalog.getString('Destiny Patch Changelog') + ' - Guardian.gg';

        $scope.loading = true;
        $scope.types = [
            {
                table: 'DestinyInventoryItemDefinition',
                slug: 'item',
                label: gettextCatalog.getString('Items')
            },
            {
                table: 'DestinyActivityDefinition',
                slug: 'activity',
                label: gettextCatalog.getString('Activities')
            },
            {
                table: 'DestinyGrimoireDefinition',
                slug: 'grimoire',
                label: gettextCatalog.getString('Grimoire')
            },
            {
                table: 'DestinyLocationDefinition',
                slug: 'location',
                label: gettextCatalog.getString('Locations')
            },
            {
                table: 'DestinyRewardSourceDefinition',
                slug: 'sources',
                label: gettextCatalog.getString('Reward Sources')
            },
            {
                table: 'DestinyStatDefinition',
                slug: 'activity',
                label: gettextCatalog.getString('Stats')
            },
            {
                table: 'DestinyVendorDefinition',
                slug: 'vendor',
                label: gettextCatalog.getString('Vendors')
            },
        ];

        $scope.hash1 = $stateParams.hash1;
        $scope.hash2 = $stateParams.hash2;
        $scope.changelogType = _.find($scope.types, function(type) {
            return type.slug == $stateParams.type;
        });

        if (!$scope.changelogType) {
            $scope.invalid = true;
            $scope.loading = false;
            return;
        }

        api
            .getChangelog('manifest', $stateParams.hash1, $stateParams.hash2)
            .then(function(response) {
                $scope.manifest = response.data;

                if (Object.keys($scope.manifest.changes).length == 0) {
                    $scope.invalid = true;
                }

                _.each($scope.manifest.changes, function(data, table) {
                    var typeDef = _.find($scope.types, function(type) {
                        return type.table == table;
                    });

                    if (typeDef) {
                        typeDef.created = data.created;
                        typeDef.updated = data.updated;
                        typeDef.deleted = data.deleted;
                        typeDef.total = data.created + data.updated + data.deleted
                    }
                });

                $rootScope.title = '[' + moment($scope.manifest.createdAt).format('YYYY-MM-DD') + '] ' +
                    gettextCatalog.getString('Destiny Patch Changelog') + ' - Guardian.gg';

                return api.getChangelog($scope.changelogType.table, $stateParams.hash1, $stateParams.hash2)
            })
            .then(function(response) {
                // angular bind-html is slow, jquery is fast, thus we use jquery here
                $('#changelog').html(response.data);

                window.gggTips && window.gggTips.run();

                if (!response.data) {
                    $scope.invalid = true;
                }

                $scope.loading = false;
            });
    }
]);
