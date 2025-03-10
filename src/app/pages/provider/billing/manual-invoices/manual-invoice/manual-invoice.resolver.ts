import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { StorageService } from '../../../../../services/storage.service';

export const manualInvoiceResolver: ResolveFn<boolean> = (route, state) => {
  return inject(HttpService).getProviderManualInvoice(inject(StorageService).getProviderID(), route.paramMap.get('invoiceId')!);
};
