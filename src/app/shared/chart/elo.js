var app = angular.module('app');

app.factory('chart-elo', [
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
                        connectNulls: true
                    }
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.x:%B %e}:</b> {point.y:.0f} Elo'
                },
                xAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    type: 'datetime',
                    minTickInterval: 3600 * 1000 * 24,
                    min: +new Date('2015-10-12')
                },
                yAxis: {
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    title: {
                        margin: 20,
                        text: 'Elo'
                    },
                    plotLines: [
                        {
                            color: consts.leagues.bronze.colors.line,
                            width: 1,
                            value: consts.leagues.bronze.to + 1
                        },
                        {
                            color: consts.leagues.silver.colors.line,
                            width: 1,
                            value: consts.leagues.silver.to + 1
                        },
                        {
                            color: consts.leagues.gold.colors.line,
                            width: 1,
                            value: consts.leagues.gold.to + 1
                        },
                        {
                            color: consts.leagues.platinum.colors.line,
                            width: 1,
                            value: consts.leagues.platinum.to + 1
                        }
                    ],
                    plotBands: [
                        {
                            color: consts.leagues.diamond.colors.band,
                            label: {
                                text: gettextCatalog.getString('Diamond').toUpperCase(),
                                verticalAlign: 'top',
                                y: 20,
                                x: 10,
                                style: {
                                    color: 'rgba(75, 139, 189, 0.6)',
                                    fontWeight: 'bold'
                                }
                            },
                            from: consts.leagues.diamond.from,
                            to: consts.leagues.diamond.to
                        },
                        {
                            color: consts.leagues.platinum.colors.band,
                            label: {
                                text: gettextCatalog.getString('Platinum').toUpperCase(),
                                verticalAlign: 'top',
                                y: 20,
                                x: 10,
                                style: {
                                    color: 'rgba(77, 158, 130, 0.6)',
                                    fontWeight: 'bold'
                                }
                            },
                            from: consts.leagues.platinum.from,
                            to: consts.leagues.platinum.to
                        },
                        {
                            color: consts.leagues.gold.colors.band,
                            label: {
                                text: gettextCatalog.getString('Gold').toUpperCase(),
                                verticalAlign: 'top',
                                y: 20,
                                x: 10,
                                style: {
                                    color: 'rgba(231, 194, 68, 0.6)',
                                    fontWeight: 'bold'
                                }
                            },
                            from: consts.leagues.gold.from,
                            to: consts.leagues.gold.to
                        },
                        {
                            color: consts.leagues.silver.colors.band,
                            label: {
                                text: gettextCatalog.getString('Silver').toUpperCase(),
                                verticalAlign: 'top',
                                y: 20,
                                x: 10,
                                style: {
                                    color: 'rgba(204, 214, 209, 0.6)',
                                    fontWeight: 'bold'
                                }
                            },
                            from: consts.leagues.silver.from,
                            to: consts.leagues.silver.to
                        },
                        {
                            color: consts.leagues.bronze.colors.band,
                            label: {
                                text: gettextCatalog.getString('Bronze').toUpperCase(),
                                verticalAlign: 'top',
                                y: 20,
                                x: 10,
                                style: {
                                    color: 'rgba(162, 124, 78, 0.6)',
                                    fontWeight: 'bold'
                                }
                            },
                            from: consts.leagues.bronze.from,
                            to: consts.leagues.bronze.to
                        }
                    ]
                }
            },
            series: {}
        };
    }
]);