import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Session } from "../session/session";
import 'rxjs/add/operator/share';
import {ItemModel} from "./model/guardian/item.model";
import {PaginationModel} from "./model/guardian/pagination.model";
import {Gettext} from "../gettext/gettext.service";

@Injectable()
export class GuardianService {
    BASE_URL: string = GUARDIAN_API + '/';

    private _authHeaders: Headers = new Headers();

    constructor(private _client: Http, private _session: Session, private gettext: Gettext) {
    }

    searchGamedata(query: string): Observable<PaginationModel> {
        return this._get('gamedata/search?q={q}', { q: query }).map(res => new PaginationModel(res.items, ItemModel));
    }

    getActivities(search: WeaponStatsFilter): Observable<any> {
        return this._get(
            'weapon/activities?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
            {
                lc: this.gettext.getCurrentLanguage(),
                mode: search.mode ? search.mode : 10,
                platform: search.platform ? search.platform : 2,
                start: search.start ? search.start : '1970-01-01',
                end: search.end ? search.end : '2099-01-01',
                activity: search.activity ? search.activity : 0
            }
        );
    }

    getTopWeapons(search: WeaponStatsFilter): Observable<any> {
        return this._get(
            'weapon/top?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
             {
                 lc: this.gettext.getCurrentLanguage(),
                 mode: search.mode ? search.mode : 10,
                 platform: search.platform ? search.platform : 2,
                 start: search.start ? search.start : '1970-01-01',
                 end: search.end ? search.end : '2099-01-01',
                 activity: search.activity ? search.activity : 0
            }
        );
    }

    getTopWeaponTypes(search: WeaponStatsFilter): Observable<any> {
        return this._get(
            'weapon/type/top?mode={mode}&platform={platform}&start={start}&end={end}&activity={activity}&lc={lc}',
            {
                lc: this.gettext.getCurrentLanguage(),
                mode: search.mode ? search.mode : 10,
                platform: search.platform ? search.platform : 2,
                start: search.start ? search.start : '1970-01-01',
                end: search.end ? search.end : '2099-01-01',
                activity: search.activity ? search.activity : 0
            }
        );
    }

    private _delete(endpoint: string, params?: any): Observable<any> {
        let url = this._url(endpoint, params);
        this._checkToken();

        let response = this._client.delete(url, { headers: this._authHeaders }).share();
        response.subscribe(null, err => {
            if (err.status == 401 && this._session.isAuthenticated()) {
                this._session.logout();
            }
        });
        return response;
    }

    private _post(endpoint: string, body: any, params?: any): Observable<any> {
        let url = this._url(endpoint, params);
        this._checkToken();

        let response = this._client.post(url, JSON.stringify(body), { headers: this._authHeaders }).map(res => res.json().data).share();
        response.subscribe(null, err => {
            if (err.status == 401 && this._session.isAuthenticated()) {
                this._session.logout();
            }
        });
        return response;
    }

    private _get(endpoint: string, params?: any): Observable<any> {
        let url = this._url(endpoint, params);
        this._checkToken();

        let response = this._client.get(url, { headers: this._authHeaders }).map(res => res.json()).share();
        response.subscribe(null, err => {
            if (err.status == 401 && this._session.isAuthenticated()) {
                this._session.logout();
            }
        });
        return response;
    }

    private _url(endpoint: string, params: any = {}): string {
        let url = this.BASE_URL + endpoint;

        if (!params.accountId && this._session.isAuthenticated()) {
            params.accountId = this._session.account.id;
        }

        for (let k in params) {
            if (!params.hasOwnProperty(k)) {
                continue;
            }

            url = url.replace('{' + k + '}', params[k]);
        }

        return url;
    }

    private _checkToken() {
        if (this._session.isAuthenticated()) {
            this._authHeaders.set('Authorization', 'Bearer ' + this._session.account.token);
        } else {
            this._authHeaders.delete('Authorization');
        }
    }
}

export interface WeaponStatsFilter {
    platform: number;
    start: string;
    end: string;
    mode: string;
    activity: string;
}
