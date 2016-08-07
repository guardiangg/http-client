export class SearchResult {
    iconPath: string;
    membershipType: number;
    membershipId: string;
    displayName: string;

    constructor(data: any) {
        this.iconPath = data.iconPath;
        this.membershipType = data.membershipType;
        this.membershipId = data.membershipId;
        this.displayName = data.displayName;
    }
}
