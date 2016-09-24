var app = angular.module('app');

app.controller('pgcrCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$stateParams',
    'consts',
    'pgcrFactory',

    function ($rootScope, $scope, $timeout, $stateParams, consts, pgcrFactory) {
        $scope.teamDefs = consts.teams;
        $scope.modeDefs = consts.modes;
        $scope.loading = {
            pgcr: true
        };

        $rootScope.title = 'Carnage Report - Guardian.gg';

        var pgcr = new pgcrFactory();
        pgcr.load($stateParams.instanceId)
            .then(function() {
                $scope.statDefs = pgcr.getStatDefinitions();
                $scope.definitions = pgcr.getDefinitions();
                $scope.mode = pgcr.getMode();
                $scope.teams = pgcr.getTeams();
                $scope.details = pgcr.getDetails();
                $scope.period = pgcr.getPeriod();
                $scope.id = $stateParams.instanceId;

                console.log($scope.mode);
                console.log($scope.teams);

                $rootScope.title = '#[' + $stateParams.instanceId + '] ' +
                    $scope.definitions.activities[$scope.details.referenceId].activityName +
                    ' (' + $scope.modeDefs[$scope.mode] + ') - Carnage Report - Guardian.gg';

                $timeout(function() {
                    $('.player-row').mouseenter(function(e) {
                        $(this).addClass('active');
                    }).mouseleave(function(e) {
                        $(this).removeClass('active');
                    }).bind('click', function(e) {
                        $(this).parent().toggleClass('open');
                        $timeout(function() {
                            window.gggTips.run();
                        });
                    });
                });

                $scope.loading.pgcr = false;
            }, function(err) {
            });
    }
]);
