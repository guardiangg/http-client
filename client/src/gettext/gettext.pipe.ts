import {Pipe, PipeTransform} from "@angular/core";
import {Gettext} from "./gettext.service";

@Pipe({
    name: 'translate'
})
export class GettextPipe implements PipeTransform {
    constructor(private _gettext: Gettext) {}

    transform(str: string): string {
        return this._gettext.getString(str);
    }
}
