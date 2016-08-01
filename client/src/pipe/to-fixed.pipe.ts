import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'toFixed'})
export class ToFixedPipe implements PipeTransform {
    transform(input: number, places: number = 2): string {
        return input.toFixed(places).replace(/\.0+$/, '');
    }
}
