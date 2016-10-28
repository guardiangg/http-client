import {Gettext} from "../gettext/gettext.service";
import {GuardianService, WeaponStatsFilter} from "../api/guardian.service";
import {Component} from "@angular/core";
import {SeoService} from "../app/seo.service";
import {AdUnitComponent} from "../ad-unit/ad-unit.component";
import * as moment from 'moment';
import { Observable } from "rxjs/Observable";

@Component({
    templateUrl: './weapon-stats.html',
    styleUrls: ['./weapon-stats.scss']
})
export class WeaponStatsComponent {
    private filters: WeaponStatsFilter = {
        platform: 1,
        start: moment().utc().subtract(30, 'days').format('YYYY-MM-DD'),
        end: moment().utc().subtract(1, 'days').format('YYYY-MM-DD'),
        mode: "10",
        activity: "0",
    };

    private lang = '';

    private activities: any[];

    private weaponsLoading: boolean = true;
    private weapons: any[];

    private weaponTypesLoading: boolean = true;
    private weaponTypes: any[];

    // TODO: move this someplace better
    private modes = [
        {
            id: 9,
            name: 'Skirmish',
        },
        {
            id: 10,
            name: 'Control',
        },
        {
            id: 11,
            name: 'Salvage',
        },
        {
            id: 12,
            name: 'Clash',
        },
        {
            id: 13,
            name: 'Rumble',
        },
        {
            id: 14,
            name: 'Trials of Osiris',
        },
        {
            id: 15,
            name: 'Doubles',
        },
        {
            id: 19,
            name: 'Iron Banner',
        },
        {
            id: 23,
            name: 'Elimination',
        },
        {
            id: 24,
            name: 'Rift',
        },
        {
            id: 28,
            name: 'Zone Control',
        },
        {
            id: 29,
            name: 'SRL',
        },
        {
            id: 523,
            name: 'Crimson Doubles',
        }
    ];

    constructor(private _seo: SeoService, private guardian: GuardianService, private gettext: Gettext) {
        this._seo.setTitle('Best Crucible Weapons - Guardian.gg');
        this._seo.setMetaDescription('');

        // doing this everywhere would suck...
        this.lang = this.gettext.getCurrentLanguage();
    }

    ngOnInit() {
        this.guardian.getActivities(this.filters).subscribe((res) => {
            this.activities = res;
        });
        this.update();
    }

    update() {
        console.log(this.filters);

        this.weapons = [];
        this.weaponsLoading = true;

        this.guardian.getTopWeapons(this.filters).subscribe((res) => {
            this.weapons = res;
            this.weaponsLoading = false;
        });

        this.weaponTypes = [];
        this.weaponTypesLoading = true;

        this.guardian.getTopWeaponTypes(this.filters).subscribe((res) => {
            this.weaponTypes = res;
            this.weaponTypesLoading = false;
        });
    }
}
