import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpService } from '../../services/http.service';

export const fixedPriceResolver: ResolveFn<boolean> = (route, state) => {
  return inject(HttpService).getPublicService(route.paramMap.get('priceId')!);
};
