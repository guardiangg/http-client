var app = angular.module('app');

app.directive('pgcr', [
    '$compile',
    '$timeout',
    'consts',
    'api',
    'bungie',
    'pgcrFactory',

    function ($compile, $timeout, consts, api, bungie, pgcrFactory) {
        return {
            restrict: 'A',
            scope: {
                instanceId: '=',
                characterId: '=',
                prefix: '@'
            },

            link: function (scope, element) {
                var elementId = scope.prefix ? scope.prefix + '_' + scope.instanceId : 'pgcr_' + scope.instanceId;
                scope.modeDefs = consts.modes;
                scope.teamDefs = consts.teams;

                var render = function() {
                    if (document.getElementById(elementId)) {
                        return;
                    }

                    var html = angular.element(
                        '<tr class="pgcr-wrapper" id="' + elementId + '">' +
                        '   <td colspan="9"><ng-include src="\'component/pgcr/pgcr.html\'"></ng-include></td>' +
                        '</tr>'
                    );

                    $compile(html.contents())(scope);
                    html.insertAfter(element.parent().parent());
                };

                var loadPgcr = function(instanceId) {
                    if (document.getElementById(elementId)) {
                        return;
                    }

                    var pgcr = new pgcrFactory();
                    pgcr.load(instanceId).then(function() {
                        scope.statDefs = pgcr.getStatDefinitions();
                        scope.definitions = pgcr.getDefinitions();
                        scope.mode = pgcr.getMode();
                        scope.teams = pgcr.getTeams();
                        scope.details = pgcr.getDetails();
                        scope.period = pgcr.getPeriod();
                        scope.isPvp = pgcr.isPvp();
                        scope.id = instanceId;
                        scope.embedded = true;

                        $timeout(function() {
                            $('.player-row')
                                .unbind('mouseenter mouseleave click')
                                .bind('mouseenter', function(e) {
                                    $(this).addClass('active');
                                })
                                .bind('mouseleave', function(e) {
                                    $(this).removeClass('active');
                                })
                                .bind('click', function(e) {
                                    $(this).parent().toggleClass('open');
                                    $timeout(function() {
                                        window.gggTips.run();
                                    });
                                });
                        });

                        element.removeClass('fa-cog fa-spin');
                        element.addClass('fa-minus-square-o');
                        render();
                    }, function(err) {
                        console.log(err);
                    })
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
