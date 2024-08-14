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
      padding: 3px 30px; /* Hacer el banner más delgado */
      font-size: 14px; /* Tamaño de texto reducido para ajustarse al diseño más delgado */
      text-align: center;
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
      max-width: 100%;
      z-index: 9999;
      border-radius: 0 0 8px 8px; /* Bordes redondeados para dar un aspecto más suave */
      box-shadow: 0 0 10px rgba(255, 77, 77, 0.5); /* Resplandor más sutil */
      animation: fadeInOut 3s ease-in-out;
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
      background: rgba(255, 77, 77, 0.2); /* Menos opacidad para un resplandor más sutil */
      z-index: -1;
      filter: blur(6px);
      opacity: 0.6;
      animation: glow 1.5s infinite alternate;
    }

    @keyframes glow {
      from { opacity: 0.6; }
      to { opacity: 0.8; }
    }
  `]
})
export class ConnectionStatusComponent {
  isOffline$ = this.networkStatusService.networkStatus$.pipe(map(status => !status));

  constructor(private networkStatusService: NetworkStatusService) {}
}
