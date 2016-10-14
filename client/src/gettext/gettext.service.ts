import * as _ from "lodash";
import { Injectable } from "@angular/core";
import {GettextStrings} from "./string.service";

@Injectable()
export class Gettext {
    private currentLanguage: string = 'en';
    private supported: any = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pl', 'pt-br'];
    private strings: any = {};

    constructor(_s: GettextStrings) {
        let lang = localStorage.getItem('lang');
        if (lang) {
            this.setCurrentLanguage(lang);
        }

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

    isSupported(lang: string): boolean {
        return this.supported.indexOf(lang) > -1;
    }

    setCurrentLanguage(lang: string) {
        lang = this.isSupported(lang) ? lang : 'en';

        localStorage.setItem('lang', lang);
        this.currentLanguage = lang;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setString(lang: string, base: string, tl: string) {
        this.strings[lang][base] = tl.length > 0 ? tl : base;
    }

    getString(base: string) {
        if (!this.strings[this.currentLanguage]) {
            return '[' + base + ']';
        }

        if (!this.strings[this.currentLanguage[base]]) {
            return '[' + base + ']';
        }

        return this.strings[this.currentLanguage][base];
    }
}
