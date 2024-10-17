// import { Component } from '@angular/core';
// import { NetworkStatusService } from '../../services/network-status.service';
// import { map } from 'rxjs';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-connection-status',
//   template: `
//     <div *ngIf="isOffline$ | async" class="offline-banner">
//       <i class="pi pi-wifi-off"></i>
//       <span>¡Estás desconectado!</span>
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

//     @keyframes pulseGlow {
//       0% { box-shadow: 0 0 8px rgba(255, 77, 77, 0.5); }
//       100% { box-shadow: 0 0 16px rgba(255, 77, 77, 1); }
//     }
//   `]
// })
// export class ConnectionStatusComponent {
//   isOffline$ = this.networkStatusService.networkStatus$.pipe(map(status => !status));

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
// }
