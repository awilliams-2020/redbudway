import { Routes } from "@angular/router";

export const BusinessRoutes: Routes = [
    {
        path: ':providerId',
        title: 'Service',
        loadComponent: () => import('./business.component').then(c => c.BusinessComponent),
    }
]