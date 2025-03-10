import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const HowItWorksRoutes: Routes = [
  {
    path: '',
    title: 'How It Works',
    loadComponent: () => import('./how-it-works.component').then(c => c.HowItWorksComponent)
  },
  {
    path: 'list-service',
    title: 'Listing A Service | How It Works',
    loadComponent: () => import('./tutorials/list-service/list-service.component').then(c => c.ListServiceComponent)
  },
  // {
  //   path: 'service-areas',
  //   title: 'Service areas | How It Works',
  //   loadComponent: () => import('./tutorials/select-areas/select-areas.component').then(c => c.SelectAreasComponent)
  // },
  // {
  //   path: 'subscriptions',
  //   title: 'Subscriptions | How It Works',
  //   loadComponent: () => import('./tutorials/subscriptions/subscriptions.component').then(c => c.SubscriptionsComponent)
  // },
  // {
  //   path: 'scheduling',
  //   title: 'Scheduling | How It Works',
  //   loadComponent: () => import('./tutorials/scheduling/scheduling.component').then(c => c.SchedulingComponent)
  // },
  // {
  //   path: 'invoicing',
  //   title: 'Invoicing | How It Works',
  //   loadComponent: () => import('./tutorials/invoice/invoice.component').then(c => c.InvoiceComponent)
  // },
  // {
  //   path: 'booking',
  //   title: 'Booking A Service | How It Works',
  //   loadComponent: () => import('./tutorials/fixed-price/fixed-price.component').then(c => c.FixedPriceComponent)
  // },
  // {
  //   path: 'quote',
  //   title: 'Requesting A Quote | How It Works',
  //   loadComponent: () => import('./tutorials/quote/quote.component').then(c => c.QuoteComponent)
  // },
  // {
  //   path: 'custom-form',
  //   title: 'Custom Forms | How It Works',
  //   loadComponent: () => import('./tutorials/custom-form/custom-form.component').then(c => c.CustomFormComponent)
  // }
];