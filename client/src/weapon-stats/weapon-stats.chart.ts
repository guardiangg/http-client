import * as _ from "lodash";
import * as moment from "moment";
import {Component, Input, OnChanges} from "@angular/core";

@Component({
    selector: 'weapon-stats-chart',
    template: '<chart *ngIf="data" [options]="options" style="display: block; width: 100%"></chart>'
})
export class WeaponStatsChart implements OnChanges {
    @Input()
    data: any;
    options: any = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'spline',
            zoomType: 'x'
        },
        title: {
            text: 'Kills by Weapon Type', //TODO: gettextCatalog.getString('Kills by Weapon Type')
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            },
            maxZoom: 48 * 3600 * 1000
        },
        yAxis: {
            title: {
                text: 'Percentage of Total Kills', //TODO: gettextCatalog.getString('Percentage of Total Kills')
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: []
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            spline: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 86400000, // 1 day,
                pointStart: Date.UTC(2014, 8, 9, 0, 0, 0)
            }
        },
        series: [
        ]
    };

    ngOnChanges() {
        if (!this.data) {
            return;
        }

        this.options.series = [];
        for (let typeName in this.data) {
            let entry = {
                data: [],
                name: typeName,
            };

            let sorted = _.sortBy(this.data[typeName], 'day');

            let row: any;
            for (row of sorted) {
                entry.data.push({
                    x: +new Date(row.day),
                    y: Math.round(row.kills * 100) / 100
                });
            }

            this.options.series.push(entry);
        }
    }
}
