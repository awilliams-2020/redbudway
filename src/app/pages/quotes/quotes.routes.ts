import { Routes } from "@angular/router";

export const quotesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./quotes.component').then(c => c.QuotesComponent),
        loadChildren: () => [
            {
                path: '',
                data: {view: 'quotes'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            },
            {
                path: ':category',
                data: {view: 'quotes'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            },
            {
                path: ':category/:subcategory',
                data: {view: 'quotes'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            }
        ]
    }
]