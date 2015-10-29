var app = angular.module('app');

app.factory('chart-subclass-win-rate', [
    'gettext',

    function (gettext) {
        return {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettext('Win Rate')
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
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
            }]
        }
    }
]);