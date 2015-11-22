var app = angular.module('app');

app.factory('chart-subclass-win-rate', [
    'gettextCatalog',

    function (gettextCatalog) {
        return {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettextCatalog.getString('Win Rate by Mode')
                },
                xAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    type: 'category'
                },
                yAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    title: {
                        text: false
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b>: {point.y:.2f}%'
                }
            },
            series: [{
                colorByPoint: true,
                data: []
            }],
            size: {
                height: 250
            }
        }
    }
]);