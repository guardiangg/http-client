var app = angular.module('app');

app.factory('chart-weapon-spline', [
    '$rootScope',
    'consts',
    'gettextCatalog',
    '$timeout',

    function ($rootScope, consts, gettextCatalog, $timeout) {
        return {
            options: {
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: gettextCatalog.getString('Kills by Weapon Type')
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        overflow: 'justify'
                    },
                    maxZoom: 48 * 3600 * 1000
                },
                yAxis: {
                    title: {
                        text: gettextCatalog.getString('Percentage of Total Kills')
                    },
                    min: 0,
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null,
                    plotBands: []
                },
                tooltip: {
                    valueSuffix: '%'
                },
                plotOptions: {
                    spline: {
                        lineWidth: 2,
                        states: {
                            hover: {
                                lineWidth: 5
                            }
                        },
                        marker: {
                            enabled: false
                        },
                        pointInterval: 86400000, // 1 day,
                        pointStart: Date.UTC(2014, 8, 9, 0, 0, 0)
                    }
                }
            },
            func: function(chart) {
                $rootScope.$on('chart.reflow', function() {
                    chart.reflow();
                });

                $timeout(function() {
                    chart.reflow();
                }, 0);
            }
        };
    }
]);