import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { StorageService } from '../../../../../services/storage.service';

export const quoteResolver: ResolveFn<boolean> = (route, state) => {
  const quoteId = route.paramMap.get("quoteId")!
  return inject(HttpService).getProviderQuote(inject(StorageService).getProviderID(), quoteId);
};
