var app = angular.module('app');

app.factory('chart-kd', [
    'gettext',

    function(gettext) {
        return {
            options: {
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: gettext('Kills / Deaths')
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    min: 0.8,
                        max: 1.15,
                        title: {
                        text: false
                    }
                },
                tooltip : {
                    headerFormat : '',
                        pointFormat : '<b>{point.name}</b>: {point.y:.2f} K:D'
                }
            },
            series: [{
                colorByPoint: true,
                showInLegend: false,
                tooltip: {
                    formatter: function() {
                        return this.x;
                    }
                },
                data: []
            }]
        }
    }
]);