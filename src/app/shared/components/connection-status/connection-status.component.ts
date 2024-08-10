import { Component } from '@angular/core';
import { NetworkStatusService } from '../../services/network-status.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-connection-status',
  template: `
    <div *ngIf="isOffline$ | async" class="offline-banner">
      ¡Estás desconectado!
    </div>
  `,
  styles: [`
    .offline-banner {
      background-color: #ff4d4d;
      color: white;
      padding: 10px;
      text-align: center;
      animation: fadeInOut 1s ease-in-out;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-100%); }
      50% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-100%); }
    }
  `]
})
export class ConnectionStatusComponent {
  isOffline$ = this.networkStatusService.networkStatus$.pipe(map(status => !status));

  constructor(private networkStatusService: NetworkStatusService) {}
}
