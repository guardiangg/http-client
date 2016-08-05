import {Directive, ElementRef} from "@angular/core";
import {Gettext} from "./gettext.service";

@Directive({
    selector: '[translate]'
})
export class GettextDirective {
    constructor(private _gettext: Gettext, private _el: ElementRef) {
    }

    ngOnInit() {
        this._el.nativeElement.innerHTML = this._gettext.getString(this._el.nativeElement.innerHTML);
    }
}
