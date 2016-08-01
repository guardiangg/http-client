import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'possessive'})
export class PossessivePipe implements PipeTransform {
    transform(str: string): string {
        if (str) {
            let lastChar = str.slice(str.length - 1);
            if (lastChar == 's') {
                str += '\'';
            } else {
                str += '\'s';
            }
        }
         
        return str;
    }
}
