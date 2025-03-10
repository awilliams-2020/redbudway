import { Routes } from '@angular/router';

export const ServicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./services.component').then(c => c.ServicesComponent),
        loadChildren: () => [
            {
                path: '',
                loadComponent: () => import('./fixed-price/list/list.component').then(c => c.ListComponent)
            },
            {
                path: 'quotes',
                loadComponent: () => import('./quote/list/list.component').then(c => c.ListComponent)
            },
        ],
    },
    {
        path: 'create',
        loadComponent: () => import('./fixed-price/create/create.component').then(c => c.CreateComponent)
    },
    {
        path: ':priceId',
        loadComponent: () => import('./fixed-price/update/update.component').then(c => c.UpdateComponent)
    },
    {
        path: 'quotes/create',
        loadComponent: () => import('./quote/create/create.component').then(c => c.CreateComponent)
    },
    {
        path: 'quotes/:quoteId',
        loadComponent: () => import('./quote/update/update.component').then(c => c.UpdateComponent)
    }
];