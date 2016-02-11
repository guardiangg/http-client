var app = angular.module('app');

app.factory('chart-popularity', [
    '$rootScope',
    'gettextCatalog',
    '$timeout',

    function ($rootScope, gettextCatalog, $timeout) {
        return {
            options: {
                chart: {
                    type: 'pie'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettextCatalog.getString('Subclass Popularity')
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
            }],
            func: function(chart) {
                $rootScope.$on('chart.reflow', function() {
                    Object.keys(chart).length > 0 && chart.reflow();
                });

                $timeout(function() {
                    Object.keys(chart).length > 0 && chart.reflow();
                }, 5000);
            }
        }
    }
]);