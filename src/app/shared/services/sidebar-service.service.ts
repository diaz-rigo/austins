import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarServiceService {
  private sidebarVisible2Subject = new BehaviorSubject<boolean>(false);
  sidebarVisible2$ = this.sidebarVisible2Subject.asObservable();

  setSidebarVisible2(visible: boolean) {
    this.sidebarVisible2Subject.next(visible);
  }
}
