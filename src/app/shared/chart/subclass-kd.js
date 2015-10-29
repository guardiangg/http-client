var app = angular.module('app');

app.factory('chart-subclass-kd', [
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
                    text: gettext('Total Subclass K/D')
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
                    pointFormat: '<b>{point.name}</b>: {point.y:.2f} K:D'
                }
            },
            series: [{
                colorByPoint: true,
                data: []
            }]
        }
    }
]);