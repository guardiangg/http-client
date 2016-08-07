import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {GettextDirective} from "../gettext/gettext.directive";

@Component({
    providers: [Title],
    directives: [GettextDirective],
    template: require('./not-found.html'),
    styles: [require('./not-found.scss')]
})
export class NotFoundComponent {
    constructor(private _title: Title) {
        this._title.setTitle('Page Not Found - Guardian.gg');
    }
}
