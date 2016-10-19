import * as _ from "lodash";
import {Component, ViewEncapsulation} from "@angular/core";
import {Router} from '@angular/router';
import {RecentService} from '../recent/recent';
import {Angulartics2} from "angulartics2/index";
import {Angulartics2GoogleAnalytics} from "angulartics2/src/providers/angulartics2-google-analytics";
import {Session} from "../session/session";
import {Gettext} from "../gettext/gettext.service";
import {BungieService, BungieResponse} from "../api/bungie.service";
import {SearchResult} from "../api/model/bungie/search-result.model";
import {SearchService} from "../search/search.service";

@Component({
    selector: 'guardian',
    // this line disables view encapsulation so we can use global (bootstrap/material) styles
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    profileQuery: string = '';
    lang: string = '';
    isCollapsed: boolean = true;
    recentProfiles: any = [];

    // we don't use the analytics services but including them causes them to initialize and begin tracking
    constructor(
        angulartics2: Angulartics2,
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private router: Router,
        private recent: RecentService,
        private search: SearchService,
        private bungie: BungieService,
        private gettext: Gettext,
        private session: Session
    ) {}

    ngOnInit()  {
        this.recent.profile.subscribe(profiles => {
            this.recentProfiles = profiles;
        });

        this.lang = this.gettext.getCurrentLanguage();
        this.recentProfiles = this.recent.getProfiles();
    }

    onSearch(player: string) {
        if (!player || player.trim().length == 0) {
            console.debug('Invalid or missing player name');
            return;
        }

        console.debug('Searching for ' + player);

        this.search.searchByName(player).subscribe(res => {
            if (res.players.length === 1) {
                console.debug('Redirect to profile');
            } else if (res.players.length > 1) {
                console.debug('Show dialog for multi profiles');
            } else if (res.players.length === 0 && res.items.results.length > 0) {
                console.debug('Redirect to item page');
            } else {
                console.debug('No results found');
            }

            this.router.navigate(['/profile', player]);
        });
    }
}
