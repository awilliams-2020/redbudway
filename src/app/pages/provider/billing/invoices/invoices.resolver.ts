import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { StorageService } from '../../../../services/storage.service';

export const invoicesResolver: ResolveFn<boolean> = (route, state) => {
  const today = new Date()
  let year = today.getFullYear()
  let quarter = 1
  if (today.getMonth() >= 0 && today.getMonth() <= 2) {
    quarter = 1
  } else if (today.getMonth() >= 3 && today.getMonth() <= 5) {
    quarter = 2
  } else if (today.getMonth() >= 6 && today.getMonth() <= 8) {
    quarter = 3
  } else if (today.getMonth() >= 9 && today.getMonth() <= 11) {
    quarter = 4
  }
  return inject(HttpService).getProviderInvoices(inject(StorageService).getProviderID()!, quarter, year, 1);
};
