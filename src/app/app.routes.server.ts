import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'provider/:providerId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/onboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/schedule',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/services',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/services/create',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/services/:priceId',
    renderMode: RenderMode.Client,
  },
  // {
  //   path: 'provider/:providerId/services/quotes',
  //   renderMode: RenderMode.Client,
  // },
  {
    path: 'provider/:providerId/discounts',
    renderMode: RenderMode.Client
  },
  {
    path: 'provider/:providerId/discounts/coupon',
    renderMode: RenderMode.Client
  },
  {
    path: 'provider/:providerId/services/quotes/create',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/services/quotes/:quoteId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/reviews',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/reviews/quotes',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/branding',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/:invoiceId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/manual/:invoiceId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/quotes/:quoteId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/quotes/:quoteId/:invoiceId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/subscriptions/:customerId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'provider/:providerId/billing/subscriptions/:customerId/:invoiceId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'fixed-prices/:category',
    renderMode: RenderMode.Client,
  },
  {
    path: 'fixed-prices/:category/:subcategory',
    renderMode: RenderMode.Client,
  },
  {
    path: 'quotes/:category',
    renderMode: RenderMode.Client,
  },
  {
    path: 'quotes/:category/:subcategory',
    renderMode: RenderMode.Client,
  },
  {
    path: 'fixed-prices',
    renderMode: RenderMode.Client
  },
  {
    path: 'quotes',
    renderMode: RenderMode.Client
  },
  {
    path: 'fixed-price/:priceId',
    renderMode: RenderMode.Client
  },
  {
    path: 'quote/:quoteId',
    renderMode: RenderMode.Client
  },
  {
    path: 'business/:providerId',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    //some component is calling sessinoStorage
    renderMode: RenderMode.Prerender
  }
];
