var app = angular.module('app');

app.factory('chart-subclass-kd', [
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
                    text: gettextCatalog.getString('K/D by Mode')
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
                    pointFormat: '<b>{point.name}</b>: {point.y:.2f} ' + gettextCatalog.getString('K:D')
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