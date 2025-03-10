import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMatomo, withRouter } from 'ngx-matomo-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideMatomo(
      {
        siteId: 1,
        trackerUrl: 'https://matomo.redbudway.com/matomo.php',
        scriptUrl: 'https://matomo.redbudway.com/matomo.js',
      },
      withRouter(),
    ),
  ]
};
