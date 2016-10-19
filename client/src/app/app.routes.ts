import { FaqComponent } from "../faq/faq.component";
import { HomeComponent } from "../home/home.component";
import { LangComponent } from '../i18n/lang.component';
import { NotFoundComponent } from "../not-found/not-found.component";
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: ':lang',
        component: LangComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'faq', component: FaqComponent },
            { path: '**', component: NotFoundComponent }
        ]
    },
    {
        path: '**',
        component: LangComponent,
    }
];

export const routing = RouterModule.forRoot(routes);
