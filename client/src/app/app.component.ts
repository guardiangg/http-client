import {Component, ViewEncapsulation} from "@angular/core";
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {RecentService} from '../recent/recent';
import {CollapseDirective, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {Angulartics2} from "angulartics2/index";
import {Angulartics2GoogleAnalytics} from "angulartics2/src/providers/angulartics2-google-analytics";
import {Session} from "../session/session";

@Component({
    selector: 'guardian',
    providers: [Location],
    // this line disables view encapsulation so we can use global (bootstrap/material) styles
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, CollapseDirective, DROPDOWN_DIRECTIVES],
    template: require('./app.html'),
    styles: [require('./app.scss')]
})
export class AppComponent {
    profileQuery: string = '';
    isCollapsed: boolean = true;
    router: Router;
    recentProfiles: any = [];

    // we don't use the analytics services but including them causes them to initialize and begin tracking
    constructor(
        router: Router,
        angulartics2: Angulartics2,
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        recent: RecentService,
        private session: Session
    ) {
        recent.profile.subscribe(profiles => {
            this.recentProfiles = profiles;
        });

        this.recentProfiles = recent.getProfiles();
        this.router = router;
    }

    onPlayer(player: string) {
        if (!player || player.trim().length == 0) {
            return;
        }

        this.router.navigate(['/profile', player]);
    }
}
