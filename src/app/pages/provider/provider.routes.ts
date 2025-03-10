import { Routes } from '@angular/router';
import { statusResolver } from './provider.resolver';
import { providerGuard } from '../../guards/provider.guard';

export const ProviderRoutes: Routes = [
    {
        path: ':providerId',
        title: 'Provider',
        resolve: {status:statusResolver},
        loadComponent: () => import('./provider.component').then(c => c.ProviderComponent),
        loadChildren: () => [
            {
                path: '',
                canActivate: [providerGuard],
                loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
            },
            {
                path: 'onboard',
                canActivate: [providerGuard],
                loadComponent: () => import('./onboard/onboard.component').then(c => c.OnboardComponent)
            },
            {
                path: 'schedule',
                canActivate: [providerGuard],
                loadComponent: () => import('./schedule/schedule.component').then(c => c.ScheduleComponent)
            },
            {
                path: 'services',
                canActivate: [providerGuard],
                loadChildren: () => import('./services/services.routes').then(r => r.ServicesRoutes)
            },
            {
                path: 'discounts',
                canActivate: [providerGuard],
                loadChildren: () => import('./discounts/discounts.routes').then(r => r.DiscountsRouting)
            },
            {
                path: 'reviews',
                canActivate: [providerGuard],
                loadChildren: () => import('./reviews/reviews.routes').then(r => r.ReviewsRouting)
            },
            {
                path: 'billing',
                canActivate: [providerGuard],
                loadChildren: () => import('./billing/billing.routes').then(r => r.BillingRouting)
            },
            {
                path: 'branding',
                canActivate: [providerGuard],
                loadComponent: () => import('./branding/branding.component').then(c => c.BrandingComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];