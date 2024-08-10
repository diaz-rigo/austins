import { Component } from '@angular/core';
import { NetworkStatusService } from '../../services/network-status.service';
import { map } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-connection-status',
  template: `
    <div *ngIf="isOffline$ | async" class="offline-banner">
      <i class="pi pi-wifi-off"></i>
      <span>¡Estás desconectado!</span>
    </div>
  `,
  styles: [`
    .offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ff4d4d;
      color: white;
      padding: 15px;
      font-size: 1.2em;
      text-align: center;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1000;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out;
    }

    .offline-banner.ng-trigger {
      transform: translateY(0);
    }

    .offline-banner i {
      font-size: 1.5em;
      margin-right: 10px;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-100%)',
      })),
      state('*', style({
        transform: 'translateY(0)',
      })),
      transition('void => *', animate('300ms ease-in')),
      transition('* => void', animate('300ms ease-out')),
    ]),
  ]
})
export class ConnectionStatusComponent {
  isOffline$ = this.networkStatusService.networkStatus$.pipe(map(status => !status));

  constructor(private networkStatusService: NetworkStatusService) {}
}
