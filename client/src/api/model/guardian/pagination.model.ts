import * as _ from "lodash";

export class PaginationModel {
    results: any = [];
    total: number;
    perPage: number;
    
    constructor(data: any, type: any) {
        this.total = data ? data.totalItems : 0;
        this.perPage = data ? data.pageCount : 0;

        if (data && data.data) {
            _.each(data.data, (d) => {
                this.results.push(new type(d));
            })
        }
    }
}
