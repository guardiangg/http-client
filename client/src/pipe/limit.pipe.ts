import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'limit'
})
export class LimitPipe implements PipeTransform {
    transform(data, limit: number): any {
        return _.filter(data, (e, k) => {
            return (k + 1) <= limit;
        });
    }
}
