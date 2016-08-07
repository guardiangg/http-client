import * as _ from "lodash";
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Session } from "../session/session";
import 'rxjs/add/operator/share';
import {ItemModel} from "./model/guardian/item.model";
import {PaginationModel} from "./model/guardian/pagination.model";

@Injectable()
export class GuardianService {
    BASE_URL: string = GUARDIAN_API + '/';

    private _authHeaders: Headers = new Headers();

    constructor(private _client: Http, private _session: Session) {
    }

    searchGamedata(query: string): Observable<PaginationModel> {
        return this._get('gamedata/search?q={q}', { q: query }).map(res => new PaginationModel(res.items, ItemModel));
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
