import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/landing/landing.component').then(c => c.LandingComponent) },
    { path: 'fixed-prices', loadChildren: () => import('./pages/fixed-prices/fixed-prices.routes').then(r => r.fixedPricesRoutes) },
    { path: 'quotes', loadChildren: () => import('./pages/quotes/quotes.routes').then(r => r.quotesRoutes) },
    { path: 'about', loadComponent: () => import('./pages/about/about.component').then(c => c.AboutComponent) },
    { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then(c => c.PrivacyComponent) },
    { path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(c => c.TermsComponent) },
    { path: 'session', loadChildren: () => import('./pages/session/session.routes').then(r => r.SessionRoutes) },
    { path: 'provider', loadChildren: () => import('./pages/provider/provider.routes').then(r => r.ProviderRoutes) },
    { path: 'how-it-works', loadChildren: () => import('./pages/how-it-works/how-it-works.routes').then(r => r.HowItWorksRoutes) },
    { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
    { path: 'fixed-price', loadChildren: () => import('./pages/fixed-price/fixed-price.routes').then(r => r.FixedPriceRoutes) },
    { path: 'quote', loadChildren: () => import('./pages/quote/quote.routes').then(r => r.QuoteRoutes) },    
    { path: 'business', loadChildren: () => import('./pages/business/business.routes').then(r => r.BusinessRoutes) },
    { path: '**', redirectTo: '404' }
];
