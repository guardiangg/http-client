var app = angular.module('app');

app.factory('chart-profile-kd', [
    'consts',
    'gettextCatalog',

    function (consts, gettextCatalog) {
        return {
            options: {
                chart: {
                    type: 'spline',
                    spacingBottom: 20,
                    spacingRight: 30,
                    spacingTop: 40,
                    spacingLeft: 10
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    line: {
                        connectNulls: true,
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.x:%B %e}:</b> {point.y:.2f} K:D',
                },
                xAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    type: 'datetime',
                    minTickInterval: 3600 * 1000 * 24
                },
                yAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    title: {
                        margin: 20,
                        text: 'K:D'
                    }
                }
            },
            series: {}
        };
    }
]);