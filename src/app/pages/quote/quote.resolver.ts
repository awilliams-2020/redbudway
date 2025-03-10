import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpService } from '../../services/http.service';

export const quoteResolver: ResolveFn<boolean> = (route, state) => {
  return inject(HttpService).getPublicQuote(route.paramMap.get('quoteId')!);
};
