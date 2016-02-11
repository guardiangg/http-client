var app = angular.module('app');

app.factory('chart-weapon-bar', [
    '$rootScope',
    'gettextCatalog',
    '$timeout',

    function ($rootScope, gettextCatalog, $timeout) {
        return {
            options: {
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'column'
                },
                title: {
                    text: gettextCatalog.getString('Kills by Weapon Type')
                },
                xAxis: {
                    type: 'category',
                    minorGridLineWidth: 0,
                    gridLineWidth: 0
                },
                yAxis: {
                    title: {
                        text: gettextCatalog.getString('Percentage of Total Kills')
                    },
                    minorGridLineWidth: 0,
                    gridLineWidth: 0
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> ' + gettextCatalog.getString('of total kills') + '<br/>'
                }
            },
            func: function(chart) {
                $rootScope.$on('chart.reflow', function() {
                    Object.keys(chart).length > 0 && chart.reflow();
                });

                $timeout(function() {
                    Object.keys(chart).length > 0 && chart.reflow();
                }, 0);
            }
        };
    }
]);