import {Component} from "@angular/core";
import {SeoService} from "../app/seo.service";
import {AdUnitComponent} from "../ad-unit/ad-unit.component";

@Component({
    template: require('./faq.html'),
    styles: [require('./faq.scss')]
})
export class FaqComponent {
    constructor(private _seo: SeoService) {
        this._seo.setTitle('FAQ - Guardian.gg');
        this._seo.setMetaDescription('Learn more about Destiny Elo, stat accuracy and get in touch with the Guardian.gg team.');
    }
}
