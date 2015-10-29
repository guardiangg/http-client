var app = angular.module('app');

app.factory('chart-popularity', [
    'gettext',

    function (gettext) {
        return {
            options: {
                chart: {
                    type: 'pie'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettext('Subclass Popularity')
                },
                xAxis: {
                    type: 'category'
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b>: {point.y:.2f}%'
                }
            },
            series: [{
                colorByPoint: true,
                showInLegend: false,
                data: []
            }]
        }
    }
]);