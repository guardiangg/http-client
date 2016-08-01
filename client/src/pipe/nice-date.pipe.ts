import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";

@Pipe({
    name: 'niceDate'
})
export class NiceDatePipe implements PipeTransform {
    transform(date: string): string {
        return moment(date).format('MMM Do YYYY, h:mma');
    }
}
