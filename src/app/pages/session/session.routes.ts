import { Routes } from '@angular/router';

export const SessionRoutes: Routes = [
    {
        path: 'provider-signup',
        title: 'Sign Up | Provider',
        loadComponent: () => import('./provider-signup/provider-signup.component').then(c => c.ProviderSignupComponent)
    },
    {
        path: 'provider-login',
        title: 'Login | Provider',
        loadComponent: () => import('./provider-login/provider-login.component').then(c => c.ProviderLoginComponent)
    },
    {
      path: 'customer-login',
      title: 'Customer Login',
      loadComponent: () => import('./customer-login/customer-login.component').then(c => c.CustomerLoginComponent)
    },
    {
      path: 'customer-signup',
      title: 'Customer Signup',
      loadComponent: () => import('./customer-signup/customer-signup.component').then(c => c.CustomerSignupComponent)
    },
    {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
      },
      {
        path: 'update-email',
        title: 'Update Email',
        loadComponent: () => import('./update-email/update-email.component').then(c => c.UpdateEmailComponent)
      },
      {
        path: 'reset-email',
        title: 'Reset Email',
        loadComponent: () => import('./reset-email/reset-email.component').then(c => c.ResetEmailComponent)
      },
      {
        path: 'update-password',
        title: 'Update Password',
        loadComponent: () => import('./update-password/update-password.component').then(c => c.UpdatePasswordComponent)
      },
      {
        path: 'reset-password',
        title: 'Reset Password',
        loadComponent: () => import('./reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
      },
      {
        path: 'verify-email',
        title: 'Verify Email',
        loadComponent: () => import('./verify-email/verify-email.component').then(c => c.VerifyEmailComponent)
      },
      {
        path: 'verify-customer',
        title: 'Verify Customer',
        loadComponent: () => import('./verify-customer/verify-customer.component').then(c => c.VerifyCustomerComponent)

      }
];