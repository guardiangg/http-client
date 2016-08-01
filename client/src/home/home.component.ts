import * as _ from 'lodash';
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {Tooltip} from "../directive/tooltip.directive";
import {SeoService} from "../app/seo.service";
import {AdUnitComponent} from "../ad-unit/ad-unit.component";

@Component({
    directives: [ROUTER_DIRECTIVES, Tooltip, AdUnitComponent],
    styles: [require('./home.scss')],
    template: require('./home.html')
})
export class HomeComponent {
    constructor(
        private _router: Router,
        private _seo: SeoService
    ) {
        this._seo.setTitle('Guardian.gg - Advanced Destiny Stats, Profiles, Leaderboards, and Database');
        this._seo.setMetaDescription('The most advanced stats for Destiny with Elo rankings, weapon usage history, item database and player profiles.');

        setTimeout(() => {
            window['twttr'] && window['twttr'].widgets.load();
        });
    }

    ngOnInit() {
    }
}
