var app = angular.module('app');

app.factory('chart-item-popularity', [
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
                legend: {
                    enabled: false
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
                    shared: true,
                    formatter: function() {
                        var s = '<b>'+ Highcharts.dateFormat('%A, %b %e, %Y', this.x)+'</b><br/>';

                        if (this.points[0]) {
                            s += '<span style="color:' + this.points[0].series.color + '">\u25CF</span>';
                            s += this.points[0].series.name + ': ' + '<strong>' + this.points[0].y + '</strong>';
                        }

                        if (this.points[0] && this.points[1]) {
                            s += '<br>';
                        }

                        if (this.points[1]) {
                            s += '<span style="color:' + this.points[1].series.color + '">\u25CF</span>';
                            s += this.points[1].series.name + ': ' + '<strong>' +  (Math.round(this.points[1].y * 10000) / 10000) + '</strong>';
                        }

                        return s;
                    }
                },
                xAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    type: 'datetime',
                    minTickInterval: 3600 * 1000 * 24
                },
                yAxis: [
                    {
                        reversed: true,
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        title: {
                            margin: 20,
                            text: gettextCatalog.getString('Rank')
                        }
                    },
                    {
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        opposite: true,
                        title: {
                            margin: 20,
                            text: gettextCatalog.getString('% of All Kills')
                        }
                    }
                ]
            },
            series: {}
        };
    }
]);
