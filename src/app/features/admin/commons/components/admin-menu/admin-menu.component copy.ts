// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { SessionService } from 'src/app/core/services/session.service';

// @Component({
//   selector: 'app-admin-menu',
//   templateUrl: './admin-menu.component.html',
//   styleUrls: ['./admin-menu.component.scss']
// })
// export class AdminMenuComponent implements OnInit {
//   userName: string | undefined; // Declarar una variable para almacenar el nombre del usuario
//   rol: string | undefined; // Declarar una variable para almacenar el nombre del usuario


//   constructor(
//     private router: Router,
//     private sessionService: SessionService
//   ) {

//   }

//   ngOnInit() {
//     const userData = this.sessionService.getUserData();
//     if (userData) {
//       this.userName = userData.name; // Asignar el nombre del usuario a la variable
//       this.rol = userData.rol; // Asignar el nombre del usuario a la variable
//     }
//     const isAuthenticated = this.sessionService.isAutenticated();
//   }
//   redirectTo(route: string): void {
//     this.router.navigate(['/admin', route]); // Utiliza la navegación de Angular
//   }


//   logout(): void {
//     // Elimina el token de autenticación del almacenamiento local
//     // this.sessionService.removeToken(); // Si ya tienes un método removeToken en tu servicio, úsalo
//     localStorage.removeItem('token'); // O elimina directamente el token del almacenamiento local aquí

//     // Navega a la ruta principal ('/')
//     this.router.navigate(['/']).then(() => {
//       // Recarga la página después de navegar a la ruta principal
//       window.location.reload();
//     });
//   }
// }
