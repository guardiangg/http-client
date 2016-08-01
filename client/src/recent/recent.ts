import * as _ from "lodash";
import { EventEmitter } from "@angular/core";

export class RecentService {
    public profile: EventEmitter<RecentProfile[]>;

    constructor() {
        console.debug('recent:created');
        this.profile = new EventEmitter<RecentProfile[]>(true);
    }

    public getProfiles() {
        return JSON.parse(localStorage.getItem('recent.profiles')) || [];
    }

    public addProfile(item: RecentProfile): void {
        console.debug('recent:addProfile');
        let recent = this.getProfiles();
        if (recent) {
            var idx = _.findIndex(recent, (e: any) => {
                return e.id == item.id;
            });

            if (idx > -1) {
                recent[idx].elo = item.elo;
                recent[idx].name = item.name;
                recent.splice(0, 0, recent.splice(idx, 1)[0]);
            } else {
                recent.unshift(item);
                if (recent.length > 5) {
                    recent.pop();
                }
            }

            localStorage.setItem('recent.profiles', JSON.stringify(recent));
        } else {
            localStorage.setItem('recent.profiles', JSON.stringify([item]));
        }

        console.debug('recent:' + localStorage.getItem('recent.profiles'));

        this.profile.emit(recent);
    }
}

export class RecentProfile {
    id: number;
    name: string;
    elo: number;

    constructor(id: number, name: string, elo: number) {
        this.id = id;
        this.name = name;
        this.elo = elo;
    }
}
