import * as _ from "lodash";
import { Injectable } from "@angular/core";
import {GettextStrings} from "./string.service";

@Injectable()
export class Gettext {
    private currentLanguage: string = 'ja';
    private supported: any = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pl', 'pt-br'];
    private strings: any = {};

    constructor(_s: GettextStrings) {
        _.each(this.supported, (lang) => {
            this.strings[lang] = {};
        });

        this.loadStrings(_s.getStrings());
    }

    loadStrings(strings: any) {
        _.each(strings, (obj: any, lang: string) => {
            _.each(obj, (tl: string, base: string) => {
                this.setString(lang, base, tl);
            });
        });
    }

    setCurrentLanguage(lang: string) {
        this.currentLanguage = this.supported.indexOf(lang) > -1 ? lang : 'en';
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setString(lang: string, base: string, tl: string) {
        this.strings[lang][base] = tl.length > 0 ? tl : base;
    }

    getString(base: string) {
        return this.strings[this.currentLanguage][base] || base;
    }
}
