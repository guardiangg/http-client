import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'eloLeague'
})
export class EloLeaguePipe implements PipeTransform {
    transform(elo: number): string {
        if (!elo) {
            return 'Placing';
        } else if (elo < 1100) {
            return 'Bronze';
        } else if (elo >= 1100 && elo < 1300) {
            return 'Silver';
        } else if (elo >= 1300 && elo < 1500) {
            return 'Gold';
        } else if (elo >= 1500 && elo < 1700) {
            return 'Platinum';
        } else if (elo >= 1700) {
            return 'Diamond';
        }
    }
}
