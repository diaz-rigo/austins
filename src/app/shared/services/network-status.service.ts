import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, mapTo, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);

  networkStatus$ = this.onlineSubject.asObservable();

  constructor() {
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    merge(online$, offline$, of(navigator.onLine)).subscribe(this.onlineSubject);
  }
}
