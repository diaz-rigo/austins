import { Component } from '@angular/core';
import { NetworkStatusService } from '../../services/network-status.service';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-connection-status',
  template: `
    <div *ngIf="isOffline$ | async" class="offline-banner">
      <i class="pi pi-wifi-off"></i>
      <span>¡Estás desconectado!</span>
    </div>

    <div *ngIf="isOnlineIndicatorVisible" class="online-indicator">
      <i class="pi pi-check-circle"></i>
      <span>¡Estás de vuelta en línea!</span>
    </div>
  `,
  styles: [`
    .offline-banner {
      background: linear-gradient(90deg, #ff4d4d, #ff1a1a);
      color: white;
      padding: 8px 16px;
      font-size: 16px;
      text-align: center;
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      max-width: 90%;
      width: auto;
      z-index: 9999;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      animation: pulseGlow 2s infinite alternate ease-in-out;
    }

    .online-indicator {
      background-color: #4caf50;
      color: white;
      padding: 8px 16px;
      font-size: 16px;
      text-align: center;
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      max-width: 90%;
      width: auto;
      z-index: 9999;
      border-radius: 0 0 16px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      animation: fadeInOut 5s forwards ease-in-out;
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 10px rgba(255, 77, 77, 0.5); }
      100% { box-shadow: 0 0 20px rgba(255, 77, 77, 1); }
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      20% { opacity: 1; transform: translateX(-50%) translateY(0); }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `]
})
export class ConnectionStatusComponent {
  isOffline$: Observable<boolean> = this.networkStatusService.networkStatus$.pipe(
    map(status => !status),
    tap(isOffline => {
      if (!isOffline) {
        this.showOnlineIndicator();
      }
    })
  );

  isOnlineIndicatorVisible = false;

  constructor(private networkStatusService: NetworkStatusService, private router: Router) {
    this.isOffline$.subscribe(isOffline => {
      if (isOffline) {
        this.navigateToOffline();
      }
    });
  }

  navigateToOffline() {
    this.router.navigate(['/portal/NoConectView']);
  }
  showOnlineIndicator() {
    this.isOnlineIndicatorVisible = true;

    // Redirige a la vista principal si está de vuelta en línea
    this.router.navigate(['/portal/home']);

    // Después de 9 segundos, ocultar el indicador
    timer(5000).subscribe(() => {
      this.isOnlineIndicatorVisible = false;
    });
  }

}
