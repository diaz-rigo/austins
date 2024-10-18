// import { Component } from '@angular/core';
// import { NetworkStatusService } from '../../services/network-status.service';
// import { map, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { Observable, timer } from 'rxjs';

// @Component({
//   selector: 'app-connection-status',
//   template: `
//     <div *ngIf="isOffline$ | async" class="offline-banner">
//       <i class="pi pi-wifi-off"></i>
//       <span>¡Estás desconectado!</span>
//     </div>

//     <div *ngIf="isOnlineIndicatorVisible" class="online-indicator">
//       <i class="pi pi-check-circle"></i>
//       <span>¡Estás de vuelta en línea!</span>
//     </div>
//   `,
//   styles: [`
//     .offline-banner {
//       background: linear-gradient(90deg, #ff4d4d, #ff1a1a);
//       color: white;
//       padding: 4px 12px;
//       font-size: 14px;
//       text-align: center;
//       position: fixed;
//       top: 0;
//       left: 50%;
//       transform: translateX(-50%);
//       max-width: 90%;
//       width: auto;
//       z-index: 9999;
//       border-radius: 0 0 12px 12px;
//       box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 8px;
//       animation: pulseGlow 2s infinite alternate;
//     }

//     .online-indicator {
//       background-color: #4caf50;
//       color: white;
//       padding: 4px 12px;
//       font-size: 14px;
//       text-align: center;
//       position: fixed;
//       top: 0;
//       left: 50%;
//       transform: translateX(-50%);
//       max-width: 90%;
//       width: auto;
//       z-index: 9999;
//       border-radius: 0 0 12px 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 8px;
//       box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
//       animation: fadeOut 3s forwards;
//     }

//     @keyframes pulseGlow {
//       0% { box-shadow: 0 0 8px rgba(255, 77, 77, 0.5); }
//       100% { box-shadow: 0 0 16px rgba(255, 77, 77, 1); }
//     }

//     @keyframes fadeOut {
//       0% { opacity: 1; }
//       100% { opacity: 0; }
//     }
//   `]
// })
// export class ConnectionStatusComponent {
//   isOffline$: Observable<boolean> = this.networkStatusService.networkStatus$.pipe(
//     map(status => !status),
//     tap(isOffline => {
//       if (!isOffline) {
//         this.showOnlineIndicator();
//       }
//     })
//   );

//   isOnlineIndicatorVisible = false;

//   constructor(private networkStatusService: NetworkStatusService, private router: Router) {
//     this.isOffline$.subscribe(isOffline => {
//       if (isOffline) {
//         this.navigateToOffline();
//       }
//     });
//   }

//   navigateToOffline() {
//     this.router.navigate(['/portal/NoConectView']);
//   }

//   showOnlineIndicator() {
//     this.isOnlineIndicatorVisible = true;
//     timer(9000).subscribe(() => {
//       this.isOnlineIndicatorVisible = false;
//     });
//   }
// }
