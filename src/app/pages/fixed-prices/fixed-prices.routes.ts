import { Routes } from "@angular/router";

export const fixedPricesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./fixed-prices.component').then(c => c.FixedPricesComponent),
        loadChildren: () => [
            {
                path: '',
                data: {view: 'fixed-prices'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            },
            {
                path: ':category',
                data: {view: 'fixed-prices'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            },
            {
                path: ':category/:subcategory',
                data: {view: 'fixed-prices'},
                loadComponent: () => import('../services/services.component').then(c => c.ServicesComponent)
            }
        ]
    }
]