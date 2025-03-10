import { Routes } from "@angular/router";

export const LandingRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./landing.component').then(c => c.LandingComponent)
    },
    {
        path: 'fixed-prices',
        loadChildren: () => [
            {
                path: ''
            },
            {

            }
        ]
    },
    {
        path: 'fixed-prices',
        loadChildren: () => [
            {
                path: ''
            },
            {
                
            }
        ]
    }
]