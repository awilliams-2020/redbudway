import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private canSort = new Subject<boolean>()
  private location = new Subject<any>()

  constructor() {}

  setCanSort(services:boolean) {
    this.canSort.next(services)
  }
  getCanSort():Observable<any> {
    return this.canSort.asObservable()
  }

  setLocation(city:string, state:string) {
    this.location.next({city, state})
  }
  getLocation():Observable<any> {
    return this.location.asObservable()
  }
  
}
