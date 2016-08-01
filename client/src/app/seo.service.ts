import {Injectable, Inject} from '@angular/core';
import {Title} from "@angular/platform-browser/src/browser/title";
import {getDOM} from '@angular/platform-browser/src/dom/dom_adapter';

// todo: fixme when bug is fixed with BrowserDomAdapter not being exported

@Injectable()
export class SeoService {
    private headElement: HTMLElement;
    private metaDescription: HTMLElement;
    private robots: HTMLElement;

    constructor(@Inject(Title) private titleService: Title) {
        this.headElement = getDOM().query('head');
        this.metaDescription = this.getOrCreateMetaElement('description');
        this.robots = this.getOrCreateMetaElement('robots');
    }

    public getTitle(): string {
        return this.titleService.getTitle();
    }

    public setTitle(title: string) {
        this.titleService.setTitle(title);
    }

    public getMetaDescription(): string {
        return this.metaDescription.getAttribute('content');
    }

    public setMetaDescription(description: string) {
        this.metaDescription.setAttribute('content', description);
    }

    public getMetaRobots(): string {
        return this.robots.getAttribute('content');
    }

    public setMetaRobots(robots: string) {
        this.robots.setAttribute('content', robots);
    }

    private getOrCreateMetaElement(name: string): HTMLElement {
        let el: HTMLElement;
        el = getDOM().query('meta[name=' + name + ']');
        if (el === null) {
            el = getDOM().createElement('meta');
            el.setAttribute('name', name);
            this.headElement.appendChild(el);
        }
        return el;
    }
}
