import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'decodeString'
})
export class DecodeStringPipe implements PipeTransform {
    transform(str: string): string {
        var element = document.createElement('div');

        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }
}
