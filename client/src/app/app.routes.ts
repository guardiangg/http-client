import { FaqComponent } from "../faq/faq.component";
import { HomeComponent } from "../home/home.component";
import { NotFoundComponent } from "../not-found/not-found.component";
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: ':lang', component: HomeComponent },
    { path: ':lang/faq', component: FaqComponent },
    { path: '**', component: NotFoundComponent }
];

export const routing = RouterModule.forRoot(routes);
