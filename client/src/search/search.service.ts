import * as _ from "lodash";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BungieResponse, BungieService} from "../api/bungie.service";
import {SearchResult} from "../api/model/bungie/search-result.model";
import {PaginationModel} from "../api/model/guardian/pagination.model";
import {GuardianService} from "../api/guardian.service";

@Injectable()
export class SearchService {
    constructor(private bungie: BungieService, private guardian: GuardianService) {}

    /**
     * Performs a nasty nested async operation to search profiles & gamedata
     * @param name
     * @returns {any}
     */
    searchByName(name: string) {
        return Observable.create(observable => {
            let players: SearchResult[] = [];
            let items: PaginationModel;

            this.guardian.searchGamedata(name).subscribe(<PaginationModel>(res) => {
                items = res;

                this.bungie.searchPlayer(-1, name).subscribe(<BungieResponse>(res) => {
                    players = players.concat(res.response.results);

                    observable.next({
                        players: players,
                        items: items
                    });

                    observable.complete();
                });
            });

        });
    }
}
