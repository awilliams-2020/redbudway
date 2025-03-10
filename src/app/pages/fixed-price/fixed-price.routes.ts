import { Routes } from '@angular/router';
import { fixedPriceResolver } from './fixed-price.resolver';

export const FixedPriceRoutes: Routes = [
    {
        path: ':priceId',
        title: 'Service',
        resolve: {fixedPrice:fixedPriceResolver},
        loadComponent: () => import('./fixed-price.component').then(c => c.FixedPriceComponent),
    }
];