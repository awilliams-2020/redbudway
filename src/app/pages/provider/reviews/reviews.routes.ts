import { Routes } from '@angular/router';

export const ReviewsRouting: Routes = [
    {
        path: '',
        loadComponent: () => import('./reviews.component').then(c => c.ReviewsComponent),
        loadChildren: () => [
            {
                path: '',
                loadComponent: () => import('./fixed-price/fixed-price.component').then(c => c.FixedPriceComponent)
            },
            {
                path: 'quotes',
                loadComponent: () => import('./quote/quote.component').then(c => c.QuoteComponent)
            }
        ]
    }
];