import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';

export const statusResolver: ResolveFn<any> = (route, state) => {
  if (!inject(StorageService).getProviderID()) {
    inject(Router).navigateByUrl('/session/provider-login')
  }
  if (inject(StorageService).getProviderID() !== route.paramMap.get('providerId')!) {
    inject(Router).navigate(['/provider', inject(StorageService).getProviderID()])
  }
  return inject(HttpService).getStripeAccountStatusV2(route.paramMap.get('providerId')!);
};
