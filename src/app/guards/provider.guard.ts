import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { StorageService } from '../services/storage.service';

export const providerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const tokenService = inject(TokenService)
  const providerId = route.url.length
    ? route.parent?.paramMap.get('providerId')!
    : route.paramMap.get('providerId')!
  const promise = inject(AuthService).isProviderSessionValid(providerId);
  promise.then((valid)=>{
    if(!valid){
      tokenService.stopCountdown()
      inject(StorageService).clear()
      router.navigate(['/session/provider-login'])
    }
  })
  return promise
};
