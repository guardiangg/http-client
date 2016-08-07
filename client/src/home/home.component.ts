import * as _ from 'lodash';
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {Tooltip} from "../directive/tooltip.directive";
import {SeoService} from "../app/seo.service";
import {AdUnitComponent} from "../ad-unit/ad-unit.component";
import {GettextDirective} from "../gettext/gettext.directive";
import {GettextPipe} from "../gettext/gettext.pipe";
import {Gettext} from "../gettext/gettext.service";

@Component({
    directives: [ROUTER_DIRECTIVES, Tooltip, AdUnitComponent, GettextDirective],
    pipes: [GettextPipe],
    styles: [require('./home.scss')],
    template: require('./home.html')
})
export class HomeComponent {
    constructor(
        private _gettext: Gettext,
        private _router: Router,
        private _route: ActivatedRoute,
        private _seo: SeoService
    ) {
        this._seo.setTitle('Guardian.gg - Advanced Destiny Stats, Profiles, Leaderboards, and Database');
        this._seo.setMetaDescription('The most advanced stats for Destiny with Elo rankings, weapon usage history, item database and player profiles.');

        let params = this._route.snapshot.params;
        if (!params['lang']) {
            this._router.navigateByUrl(this._gettext.getCurrentLanguage());
            return;
        }

        setTimeout(() => {
            window['twttr'] && window['twttr'].widgets.load();
        });
    }

    ngOnInit() {
    }
}
