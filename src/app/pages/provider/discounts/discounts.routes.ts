import { Routes } from '@angular/router';

export const DiscountsRouting: Routes = [
    {
        path: '',
        loadComponent: () => import('./discounts.component').then(c => c.DiscountsComponent),
    },
    {
        path: 'coupon',
        loadComponent: () => import('./coupon/coupon.component').then(c => c.CouponComponent),
    }
];