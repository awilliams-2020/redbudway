import { Routes } from '@angular/router';
import { invoicesResolver } from './invoices/invoices.resolver';
import { invoiceResolver } from './invoices/invoice/invoice.resolver';
import { quoteResolver } from './quotes/quote/quote.resolver';
import { manualInvoicesResolver } from './manual-invoices/manual-invoices.resolver';

export const BillingRouting: Routes = [
    {
        path: '',
        loadComponent: () => import('./billing.component').then(c => c.BillingComponent),
        loadChildren: () => [
            {
                path: '',
                loadComponent: () => import('./invoices/invoices.component').then(c => c.InvoicesComponent)
            },
            {
                path: 'manual',
                loadComponent: () => import('./manual-invoices/manual-invoices.component').then(c => c.ManualInvoicesComponent)
            },
            {
                path: 'subscriptions',
                loadComponent: () => import('./subscriptions/subscriptions.component').then(c => c.SubscriptionsComponent)
            },
            {
                path: 'quotes',
                loadComponent: () => import('./quotes/quotes.component').then(c => c.QuotesComponent)
            }
        ]
    },
    {
        path: ':invoiceId',
        resolve: {invoice: invoiceResolver},
        loadComponent: () => import('./invoices/invoice/invoice.component').then(c => c.InvoiceComponent)
    },
    {
        path: 'manual/create',
        loadComponent: () => import('./manual-invoices/manual-invoice/create/create.component').then(c => c.CreateComponent)
    },
    {
        path: 'manual/:invoiceId',
        resolve: {invoice: invoiceResolver},
        loadComponent: () => import('./manual-invoices/manual-invoice/manual-invoice.component').then(c => c.ManualInvoiceComponent)
    },
    {
        path: 'quotes/:quoteId',
        resolve: {quote: quoteResolver},
        loadComponent: () => import('./quotes/quote/quote.component').then(c => c.QuoteComponent)
    },
    {
        path: 'quotes/:quoteId/:invoiceId',
        loadComponent: () => import('./quotes/quote-invoice/quote-invoice.component').then(c => c.QuoteInvoiceComponent)
    },
    {
        path: 'subscriptions/:customerId',
        loadComponent: () => import('./subscriptions/customer/customer.component').then(c => c.CustomerComponent)
    },
    {
        path: 'subscriptions/:customerId/:invoiceId',
        loadComponent: () => import('./subscriptions/subcription-invoice/subcription-invoice.component').then(c => c.SubcriptionInvoiceComponent)
    }
];