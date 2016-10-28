import {Directive, ElementRef, Input, OnDestroy} from "@angular/core";
import * as Highcharts from "highcharts";

@Directive({selector: 'chart'})
export class ChartDirective implements OnDestroy {
    hostElement: ElementRef;
    chart: HighchartsChartObject;
    @Input('options')
    options: HighchartsOptions;

    constructor(ele: ElementRef) {
        this.hostElement = ele;
    }

    ngOnInit() {
        if (this.chart) {
            this.chart.destroy();
        }

        if (!this.options.chart) {
            this.options.chart = {};
        }
        this.options.chart.renderTo = this.hostElement.nativeElement;
        this.chart = new Highcharts.Chart(this.options);
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
