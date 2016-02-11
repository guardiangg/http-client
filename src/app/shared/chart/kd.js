var app = angular.module('app');

app.factory('chart-kd', [
    '$rootScope',
    'gettextCatalog',
    '$timeout',

    function($rootScope, gettextCatalog, $timeout) {
        return {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettextCatalog.getString('Kills / Deaths')
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    min: 0.8,
                        max: 1.15,
                        title: {
                        text: false
                    }
                },
                tooltip : {
                    headerFormat : '',
                        pointFormat : '<b>{point.name}</b>: {point.y:.2f} ' + gettextCatalog.getString('K:D')
                }
            },
            series: [{
                colorByPoint: true,
                showInLegend: false,
                tooltip: {
                    formatter: function() {
                        return this.x;
                    }
                },
                data: []
            }],
            func: function(chart) {
                $rootScope.$on('chart.reflow', function() {
                    chart.reflow();
                });

                $timeout(function() {
                    chart.reflow();
                }, 0);
            }
        }
    }
]);