import * as _ from 'lodash';
import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SeoService} from "../app/seo.service";
import {Gettext} from "../gettext/gettext.service";

@Component({
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
}
