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
      padding: 5px; /* Hacer el banner más delgado */
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      animation: fadeInOut 3s ease-in-out;
      box-shadow: 0 0 15px rgba(255, 77, 77, 0.7); /* Añadir resplandor */
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-100%); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-100%); }
    }

    .offline-banner::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 77, 77, 0.3);
      z-index: -1;
      filter: blur(8px);
      opacity: 0.7;
      animation: glow 1.5s infinite alternate;
    }

    @keyframes glow {
      from { opacity: 0.7; }
      to { opacity: 1; }
    }
  `]
})
export class ConnectionStatusComponent {
  isOffline$ = this.networkStatusService.networkStatus$.pipe(map(status => !status));

  constructor(private networkStatusService: NetworkStatusService) {}
}
