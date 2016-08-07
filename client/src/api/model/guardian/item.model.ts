export class ItemModel {
    hash: number;
    name: string;
    description: string;
    
    constructor(data: any) {
        this.hash = data.hash;
        this.name = data.name;
        this.description = data.description;
    }
}
