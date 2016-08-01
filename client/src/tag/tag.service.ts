import {Injectable} from "@angular/core";

@Injectable()
export class TagService {
    static developers: any = [
        'SpiffyJr',
        'qqkachoochoo',
        'rale00',
    ];

    static epic: any = [
        'EpicElleWray'
    ];

    static isDeveloper(name: string): boolean {
        return TagService.developers.indexOf(name) > -1;
    }

    static isEpic(name: string): boolean {
        return TagService.epic.indexOf(name) > -1 ||
            name.toLowerCase().substr(0, 6) === '[epic]' ||
            name.toLowerCase().substr(0, 9) === '[epic_cs]';
    }
}
