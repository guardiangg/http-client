import {Directive, ElementRef} from "@angular/core";
import {Gettext} from "./gettext.service";

@Directive({
    selector: '[translate]'
})
export class GettextDirective {
    constructor(private _gettext: Gettext, private _el: ElementRef) {
    }

    ngOnInit() {
        let term = this._el.nativeElement.innerHTML;
        term = term.replace(/(\r\n|\n|\r)/gm, ' ')
            .replace(/\s\s+/g, ' ')
            .trim();

        this._el.nativeElement.innerHTML = this._gettext.getString(term);
    }
}
