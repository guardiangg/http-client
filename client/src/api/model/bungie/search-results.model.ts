import * as _ from "lodash";
import {SearchResult} from "./search-result.model";

export class SearchResults {
    results: SearchResult[] = [];
    
    constructor(data: any) {
        _.each(data, (d) => {
            this.results.push(new SearchResult(d));
        });
    }
}
