import { Routes } from '@angular/router';
import { quoteResolver } from './quote.resolver';

export const QuoteRoutes: Routes = [
    {
        path: ':quoteId',
        title: 'Service',
        resolve: {quote:quoteResolver},
        loadComponent: () => import('./quote.component').then(c => c.QuoteComponent),
    }
];