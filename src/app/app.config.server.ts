import { mergeApplicationConfig, ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { isPlatformServer } from '@angular/common';
import { SESSION_STORAGE } from './services/storage.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    {
      provide: SESSION_STORAGE,
      useFactory: (platformId: object) => {
      if (isPlatformServer(platformId)) {
        return {}
      }
      return sessionStorage;
      },
      deps: [PLATFORM_ID],
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
