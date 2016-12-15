var app = angular.module('app');

app.controller('pgcrCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$stateParams',
    '$filter',
    'consts',
    'pgcrFactory',

    function ($rootScope, $scope, $timeout, $stateParams, $filter, consts, pgcrFactory) {
        $scope.teamDefs = consts.teams;
        $scope.modeDefs = consts.modes;
        $scope.loading = {
            pgcr: true
        };

        $scope.getMedalCount = function(arr) {
            var medals = $filter('medals')(arr);
            var count = 0;

            _.each(medals, function(medal) {
                count += medal.basic.value;
            });

            return count;
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
                $scope.teamScore = pgcr.getTeamScore();
                $scope.duration = pgcr.getDuration();
                $scope.durationDisplay = pgcr.getDurationDisplay();
                $scope.id = $stateParams.instanceId;

                if ($scope.teamScore && $scope.duration) {
                    $scope.rating = Math.floor(($scope.teamScore / $scope.duration) * 100);
                }

                // Bungie's gaff on strike modes. Remove if bungie ever fixes this on the API.
                if (consts.strikes.heroic.indexOf($scope.details.referenceId.toString()) > -1) {
                    $scope.mode = 17;

                } else if (consts.strikes.normal.indexOf($scope.details.referenceId.toString()) > -1) {
                    $scope.mode = 3;

                } else if ($scope.mode == 17) {
                    $scope.mode = 16;
                }

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
