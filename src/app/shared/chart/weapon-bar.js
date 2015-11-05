var app = angular.module('app');

app.factory('chart-weapon-bar', [
    'gettext',

    function (gettext) {
        return {
            options: {
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'column'
                },
                title: {
                    text: gettext('Kills by Weapon Type')
                },
                xAxis: {
                    type: 'category',
                    minorGridLineWidth: 0,
                    gridLineWidth: 0
                },
                yAxis: {
                    title: {
                        text: gettext('Percentage of Total Kills')
                    },
                    minorGridLineWidth: 0,
                    gridLineWidth: 0
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total kills<br/>'
                }
            }
        };
    }
]);