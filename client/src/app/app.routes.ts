import { FaqComponent } from "../faq/faq.component";
import { HomeComponent } from "../home/home.component";
import { NotFoundComponent } from "../not-found/not-found.component";
import { provideRouter, RouterConfig } from '@angular/router';

const routes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'faq', component: FaqComponent },
    { path: '*', component: NotFoundComponent }
];

export const appRouterProviders = [
    provideRouter(routes)
];
