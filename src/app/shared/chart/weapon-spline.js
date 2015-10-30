var app = angular.module('app');

app.factory('chart-weapon-spline', [
    'consts',
    'gettext',

    function (consts, gettext) {
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
                    text: gettext('Kills by Weapon Type')
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
                        text: gettext('Percentage of Total Kills')
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
            }
        };
    }
]);