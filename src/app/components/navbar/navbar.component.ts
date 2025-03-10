import { afterNextRender, ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../services/storage.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    ToastComponent,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private changeDetector = inject(ChangeDetectorRef)
  private httpService = inject(HttpService)
  private tokenService = inject(TokenService)
  private storageService = inject(StorageService)
  private router = inject(Router)
  private modalService = inject(NgbModal)

  public customerId: string = ''
  public adminId: string = ''
  public providerId: string = ''
  public isCustomerLoggedIn: boolean = false
  public isProviderLoggedIn: boolean = false

  constructor() {   
    afterNextRender(() => {
      this.adminId = this.storageService.getAdminID()
      this.customerId = this.storageService.getCustomerID()
      this.providerId = this.storageService.getProviderID()
      this.isProviderLoggedIn = this.storageService.isProviderLoggedIn()
      this.isCustomerLoggedIn = this.storageService.isCustomerLoggedIn()
      this.tokenService.restart()
      this.changeDetector.detectChanges()
    })
  }

  deleteProviderAccount() {
    // const modalRef = this.modalService.open(ContinueComponent, { centered: true });
    // modalRef.componentInstance.message = 'Are you sure you want to delete your account?'
    // modalRef.result.then(() => {
    //   this.httpService.deleteProviderAccount(this.providerId)
    //     .subscribe((resp: any) => {
    //       if (resp.deleted) {
    //         this.tokenService.stopCountdown()
    //         sessionStorage.clear()
    //         this.providerId = ""
    //         this.adminId = ""
    //         this.router.navigateByUrl('/')
    //       } else {
    //         this.openInvoices('We can not delete your account. There are open subscriptions and invoices tied to your account. If you have any questions reach out to <a href="mailto:service@redbudway.com">service@redbudway.com</a>.') 
    //       }
    //     })
    // }, (reason: any) => {
    // });
  }

  logOut() {
    if(this.adminId) {
      this.adminLogOut()
    } else {
      this.providerLogOut()
    }
  }

  adminLogOut() {
    this.httpService.providerLogOut(this.adminId).subscribe((resp: any) => {
      if (resp.loggedOut) {
        this.tokenService.stopCountdown()
        this.storageService.clear()
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.navigateByUrl('/', {onSameUrlNavigation: 'reload'})
      } else {
        // this.toastService.show('There was an issue logging out', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  providerLogOut() {
    this.httpService.providerLogOut(this.providerId).subscribe((resp: any) => {
      if (resp.loggedOut) {
        this.tokenService.stopCountdown()
        this.storageService.clear()
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.navigateByUrl('/', {onSameUrlNavigation: 'reload'})
      } else {
        // this.toastService.show('There was an issue logging out', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  customerLogOut() {
    this.httpService.customerLogOut(this.customerId).subscribe((resp: any) => {
      if (resp.loggedOut) {
        this.tokenService.stopCountdown()
        this.storageService.clear()
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.navigateByUrl('/', {onSameUrlNavigation: 'reload'})
      } else {
        // this.toastService.show('Failed to log out', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  customerBilling() {
    this.httpService.getStripeBillingLink(this.customerId).subscribe((resp: any) => {
      if (resp.url !== '') {
        location.href = resp.url
      }
    })
  }

  openInvoices(message: string) {
    // const modalRef = this.modalService.open(ContinueComponent, { centered: true });
    // modalRef.componentInstance.message = message
    // modalRef.result.then(() => {
    // }, () => {});
  }

  deleteCustomerAccount() {
    // const modalRef = this.modalService.open(ContinueComponent, { centered: true });
    // modalRef.componentInstance.message = 'Are you sure you want to delete your account?'
    // modalRef.result.then((result: any) => {
    //   this.httpService.deleteCustomerAccount(this.customerId)
    //     .subscribe((resp: any) => {
    //       if (resp.deleted) {
    //         this.tokenService.stopCountdown()
    //         sessionStorage.clear()
    //         this.customerId = ""
    //         this.router.navigateByUrl('/')
    //       } else {
    //         this.openInvoices('We can not delete your account. There are invoices tied to your account. If you have any questions reach out to <a href="mailto:service@redbudway.com">service@redbudway.com</a>.')
    //       }
    //     })
    // }, () => {});
  }

  track() {
    // this.matomoTracker.trackEvent("menu", "clicked")
  }
}
