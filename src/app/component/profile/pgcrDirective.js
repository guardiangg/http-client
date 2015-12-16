var app = angular.module('app');

app.directive('pgcr', [
    'consts',
    'api',
    'bungie',
    '$compile',

    function (consts, api, bungie, $compile) {
        return {
            restrict: 'A',
            scope: {
                instanceId: '=',
                characterId: '='
            },

            link: function (scope, element) {
                var elementId = 'pgcr_' + scope.instanceId;

                var render = function() {
                    if (document.getElementById(elementId)) {
                        return;
                    }

                    var html = angular.element(
                        '<tr class="pgcr-wrapper" id="' + elementId + '">' +
                        '   <td colspan="9"><ng-include src="\'component/profile/pgcr.html\'"></ng-include></td>' +
                        '</tr>'
                    );

                    $compile(html.contents())(scope);
                    html.insertAfter(element.parent().parent());
                };

                var loadPgcr = function(instanceId) {
                    if (document.getElementById(elementId)) {
                        return;
                    }

                    bungie
                        .getPgcr(instanceId)
                        .then(function(response) {
                            var data = response.data.Response.data;

                            scope.mode = data.activityDetails.mode;
                            scope.players = data.entries;
                            var membershipIds = [];
                            _.each(scope.players, function(player) {
                                membershipIds.push(player.player.destinyUserInfo.membershipId);
                            });

                            var match, day;
                            if (match = data.period.match(/\d+-\d+-\d+/)) {
                                day = match[0];
                            }

                            if (!day) {
                                return;
                            }

                            return api.getEloHistory(membershipIds, day, data.activityDetails.mode);
                        }).then(function(result) {
                            var elos = result.data;
                            var avgs = {alpha: {value: 0, count: 0}, bravo: {value: 0, count: 0}};

                            _.each(scope.players, function(player) {
                                player.elo = _.find(elos, function(elo) {
                                    return elo.membershipId == player.player.destinyUserInfo.membershipId;
                                });

                                if (!player.values.team) {
                                    return;
                                }

                                var team = player.values.team.basic.displayValue.toLowerCase();

                                if (!avgs[team]) {
                                    return;
                                }

                                if (player.elo) {
                                    avgs[team].value += player.elo ? player.elo.elo : 1200;
                                    avgs[team].count++;
                                }
                            });

                            scope.teamElo = {
                                bravo: Math.round(avgs.bravo.value / avgs.bravo.count),
                                alpha: Math.round(avgs.alpha.value / avgs.alpha.count)
                            };

                            for (var i = 0; i < scope.players.length; i++) {
                                var player = scope.players[i];

                                if (player.values.standing.basic.value == 0) {
                                    scope.winner = player;
                                    break;
                                }
                            }

                            _.sortBy(scope.players, 'values.score.basic.value');

                            element.removeClass('fa-cog fa-spin');
                            element.addClass('fa-minus-square-o');
                            render();
                        });
                };

                element.parent().parent().click(function(e) {
                    var ele = angular.element(document.getElementById(elementId));
                    element.removeClass('fa-plus-square-o');
                    element.removeClass('fa-minus-square-o');
                    if (ele && ele.length > 0) {
                        element.addClass(ele.css('display') == 'table-row' ? 'fa-plus-square-o' : 'fa-minus-square-o');
                        document.getElementById(elementId).style.display = ele.css('display') == 'table-row' ? 'none' : 'table-row';
                    } else {
                        element.addClass('fa-cog fa-spin');
                        loadPgcr(scope.instanceId);
                    }
                });
            }
        }
    }
]);
