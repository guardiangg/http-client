import * as _ from "lodash";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/share';
import {SearchResults} from "./model/bungie/search-results.model";
import {SearchResult} from "./model/bungie/search-result.model";

export class BungieResponse {
    success: boolean;
    raw: any;
    response: any;

    constructor(data: any, type: any) {
        this.response = data;

        if (data.ErrorStatus == 'Success') {
            this.success = true;
            this.response = new type(data.Response);
        } else {
            this.success = false;
        }
    }
}

@Injectable()
export class BungieService {
    BASE_URL: string = BUNGIE_API + '/Platform/Destiny/';

    constructor(private _client: Http) {
    }

    searchPlayer(platform: number, name: string): Observable<BungieResponse> {
        return this._get('SearchDestinyPlayer/{platform}/{name}/', {
            platform: platform,
            name: name
        }).map(res => new BungieResponse(res, SearchResults));
    }

    private _get(endpoint: string, params?: any): Observable<any> {
        let url = this._url(endpoint, params);

        let response = this._client.get(url).map(res => res.json()).share();
        response.subscribe(null, err => {
            console.error(err);
        });
        return response;
    }

    private _url(endpoint: string, params: any = {}): string {
        let url = this.BASE_URL + endpoint;

        for (let k in params) {
            if (!params.hasOwnProperty(k)) {
                continue;
            }

            url = url.replace('{' + k + '}', params[k]);
        }

        return url;
    }
}
