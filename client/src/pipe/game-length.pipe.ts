import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'gameLength'
})
export class GameLengthPipe implements PipeTransform {
    transform(seconds: number): string {
        let str = '';

        let hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        if (hours) {
            str += hours + ':';
        }

        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        if (hours) {
            str += ('00' + minutes.toString()).slice(-2) + ':';
        } else if (minutes) {
            str += minutes + ':';
        }

        if (minutes || hours) {
            str += ('00' + seconds.toString()).slice(-2);
        } else {
            str += seconds + 's';
        }

        return str.trim();
    }
}
