export const environment = {
  protocol: 'https',
  host: 'dev.redbudway.com',
  domainHost: 'dev.domain.redbudway.com',
  gClientId: '967613844158-4uba2iagsg4e5pv1tr42fp7ice7nserp.apps.googleusercontent.com',
  reCaptchaKey: '6Lf_uGIpAAAAAEIo18U_hwaT-HwY0-AjkyOIotqv',
  admin :{
    login: '/v1/admin/login',
    create: '/v1/admin',
    tradespeople: '/v1/admin/{adminId}/tradespeople',
    accessToken: '/v1/admin/{adminId}/access-token',
  },
  location: '/v1/location',
  address: '/v1/address',
  tradesperson: {
    create: '/v1/tradesperson',
    account: '/v1/tradesperson/{providerID}',
    sync: '/v1/tradesperson/{providerID}/sync',
    profile: '/v1/tradesperson/{providerID}/profile',
    branding: '/v1/tradesperson/{providerID}/branding',
    email: '/v1/tradesperson/{providerID}/email',
    settings: '/v1/tradesperson/{providerID}/settings',
    timeZone: '/v1/tradesperson/{providerID}/time-zone',
    accessToken: '/v1/tradesperson/{providerID}/access-token',
    billing: {
      invoices: '/v1/tradesperson/{providerID}/billing/invoices',
      invoicePages: '/v1/tradesperson/{providerID}/billing/invoice/pages',
      invoice: {
        retrieve: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}',
        update: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}',
        delete: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}',
        void: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}/void',
        finalize: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}/finalize',
        refund: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}/refund',
        uncollectible: '/v1/tradesperson/{providerID}/billing/invoice/{invoiceId}/uncollectible'
      },
      manualInvoices: '/v1/tradesperson/{providerID}/billing/manual-invoices',
      manualInvoicePages: '/v1/tradesperson/{providerID}/billing/manual-invoice/pages',
      manualInvoice: {
        create: '/v1/tradesperson/{providerID}/billing/manual-invoice',
        retrieve: '/v1/tradesperson/{providerID}/billing/manual-invoice/{invoiceId}',
        void: '/v1/tradesperson/{providerID}/billing/manual-invoice/{invoiceId}/void',
        delete: '/v1/tradesperson/{providerID}/billing/manual-invoice/{invoiceId}/delete',
        refund: '/v1/tradesperson/{providerID}/billing/manual-invoice/{invoiceId}/refund',
        uncollectible: '/v1/tradesperson/{providerID}/billing/manual-invoice/{invoiceId}/uncollectible',

      },
      quotes: '/v1/tradesperson/{providerID}/billing/quotes',
      quotePages: '/v1/tradesperson/{providerID}/billing/quote/pages',
      quote: {
        create: '/v1/tradesperson/{providerID}/billing/quote',
        retrieve: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}',
        update: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}',
        finalize: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/finalize',
        cancel: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/cancel',
        revise: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/revise',
        pdf: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/pdf',
        invoice: {
          retrieve: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}',
          update: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}',
          void: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}/void',
          refund: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}/refund',
          finalize: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}/finalize',
          uncollectible: '/v1/tradesperson/{providerID}/billing/quote/{quoteId}/invoice/{invoiceId}/uncollectible'
        }
      },
      customer: {
        subscriptions: {
          retrieve: '/v1/tradesperson/{providerID}/billing/customer/{stripeId}/subscriptions',
          cancel: '/v1/tradesperson/{providerID}/billing/customer/{stripeId}/subscriptions/cancel'
        },
        subscription: {
          invoice: '/v1/tradesperson/{providerID}/billing/customer/{stripeId}/subscription/{subscriptionId}/invoice/{invoiceId}',
          refund: '/v1/tradesperson/{providerID}/billing/customer/{stripeId}/subscription/{subscriptionId}/invoice/{invoiceId}/refund'
        },
      },
      subscriptions: '/v1/tradesperson/{providerID}/billing/subscriptions',
      subscriptionPages: '/v1/tradesperson/{providerID}/billing/subscription/pages',
      customers: '/v1/tradesperson/{providerID}/billing/customers'
    },
    login: '/v1/tradesperson/login',
    logOut: '/v1/tradesperson/{providerID}/logout',
    onboard: '/v1/tradesperson/{providerID}/onboard',
    loginLink: '/v1/tradesperson/{providerID}/login-link',
    fixedPrices: '/v1/tradesperson/{providerID}/fixed-prices',
    fixedPricePages: '/v1/tradesperson/{providerID}/fixed-price/pages',
    fixedPrice: {
      create: '/v1/tradesperson/{providerID}/fixed-price',
      retrieve: '/v1/tradesperson/{providerID}/fixed-price/{priceId}',
      update: '/v1/tradesperson/{providerID}/fixed-price/{priceId}',
    },
    quotes: '/v1/tradesperson/{providerID}/quotes',
    quotePages: '/v1/tradesperson/{providerID}/quote/pages',
    quote: {
      create: '/v1/tradesperson/{providerID}/quote',
      retrieve: '/v1/tradesperson/{providerID}/quote/{quoteId}',
      update: '/v1/tradesperson/{providerID}/quote/{quoteId}'
    },
    timeSlots: '/v1/tradesperson/{providerID}/time-slots',
    timeSlot: {
      invoice: '/v1/tradesperson/time-slot/invoice'
    },
    schedule: '/v1/tradesperson/{providerID}/schedule',
    fixedPriceReviews: '/v1/tradesperson/{providerID}/fixed-price/reviews',
    quoteReviews: '/v1/tradesperson/{providerID}/quote/reviews',
    fixedPriceReview: '/v1/tradesperson/{providerID}/fixed-price/review',
    quoteReview: '/v1/tradesperson/{providerID}/quote/review',
    googleToken: '/v1/tradesperson/{providerID}/google-token',
    coupon : {
      create: '/v1/tradesperson/{providerID}/coupon',
      retrieve: '/v1/tradesperson/{providerID}/coupon/{couponId}',
      delete: '/v1/tradesperson/{providerID}/coupon/{couponId}',
      update: '/v1/tradesperson/{providerID}/coupon/{couponId}'
    },
    promo: {
      create: '/v1/tradesperson/{providerID}/coupon/{couponId}/promo',
      retrieve: '/v1/tradesperson/{providerID}/promo/{promoId}',
      update: '/v1/tradesperson/{providerID}/promo/{promoId}',
      delete: '/v1/tradesperson/{providerID}/promo/{promoId}'
    },
    discounts: '/v1/tradesperson/{providerID}/discounts',
    services: '/v1/tradesperson/{providerID}/services',
    subdomain: '/domain/v1/tradesperson/{providerID}/subdomain'
  },
  customer: {
    create: '/v1/customer',
    account: '/v1/customer/{customerId}',
    verify: '/v1/customer/{customerId}/verify',
    reverify: '/v1/customer/{customerId}/reverify',
    fixedPriceReview: '/v1/customer/{customerId}/fixed-price/{priceId}/review',
    subscriptionReview: '/v1/customer/{customerId}/subscription/{priceId}/review',
    quoteReview: '/v1/customer/{customerId}/quote/{quoteId}/review',
    requestQuote: '/v1/customer/{customerId}/quote/{quoteId}/request',
    bookFixedPrice: '/v1/customer/{customerId}/fixed-price/{priceId}/book',
    bookSubscription: '/v1/customer/{customerId}/subscription/{priceId}/book',
    defaultPayment: '/v1/customer/{customerId}/payment/default',
    billingLink: '/v1/customer/{customerId}/billing-link',
    login: '/v1/customer/login',
    logOut: '/v1/customer/{customerId}/logout',
    accessToken: '/v1/customer/{customerId}/access-token',
    quotes: '/v1/customer/{customerId}/quotes',
    quote: '/v1/customer/{customerId}/quote/{quoteId}',
    quotePdf: '/v1/customer/{customerId}/quote/{quoteId}/pdf',
    acceptQuote: '/v1/customer/{customerId}/quote/{quoteId}/accept',
    promo: '/v1/customer/{customerId}/promo'
  },
  resetPassword: '/v1/reset-password',
  forgotPassword: '/v1/forgot-password',
  fixedPriceReviews: '/v1/fixed-price/{priceId}/reviews',
  fixedPrices: '/v1/fixed-prices',
  fixedPricePages: '/v1/fixed-price/pages',
  quotes: '/v1/quotes',
  quotePages: '/v1/quote/pages',
  fixedPrice: '/v1/fixed-price/{priceId}',
  quoteReviews: '/v1/quote/{quoteId}/reviews',
  quote: '/v1/quote/{quoteId}',
  profile: '/v1/profile/{providerID}',
  profileFixedPrices: '/v1/profile/{providerID}/fixed-prices',
  profileQuotes: '/v1/profile/{providerID}/quotes'
};
