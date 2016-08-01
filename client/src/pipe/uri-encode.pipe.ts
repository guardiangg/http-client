import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'uriEncode'
})
export class UriEncodePipe implements PipeTransform {
    transform(uri: string): string {
        return encodeURIComponent(uri);
    }
}
