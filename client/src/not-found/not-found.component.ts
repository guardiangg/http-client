import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component({
    templateUrl: './not-found.html',
    styleUrls: ['./not-found.scss']
})
export class NotFoundComponent {
    constructor(private _title: Title) {
        this._title.setTitle('Page Not Found - Guardian.gg');
    }
}
