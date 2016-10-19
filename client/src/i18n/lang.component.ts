import {Component} from "@angular/core";
import {Gettext} from "../gettext/gettext.service";
import {ActivatedRoute, Router, Params} from '@angular/router';

@Component({
    template: '<router-outlet></router-outlet>'
})
export class LangComponent {
    constructor(private route: ActivatedRoute, private router: Router, private gettext: Gettext) { }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            let lang = params['lang'];

            if (this.gettext.isSupported(lang)) {
                this.gettext.setCurrentLanguage(lang);
            } else {
                console.error('unsupported language: ' + lang);
                this.router.navigate(['en']);
            }
        });
    }
}