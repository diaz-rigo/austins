import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/services/session.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
    // encapsulation: ViewEncapsulation.None,
})
export class AdminMenuComponent implements OnInit {
  userName: string | undefined;
  rol: string | undefined;
  sidenav = { opened: false };
  productosMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.userName = userData.name;
      this.rol = userData.rol;
    }

    this.productosMenuItems = [
      {
        label: 'Ver Productos',
        icon: 'pi pi-eye',
        command: () => {
          this.toggleSidebar();
          this.redirectTo('products-list');
        }
      },
      {
        label: 'Editar Productos',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Dar de Alta Producto',
        icon: 'pi pi-plus'
      }
    ];
  }

  toggleSidebar(): void {
    this.sidenav.opened = !this.sidenav.opened;
  }

  redirectTo(route: string): void {
    this.router.navigate(['/admin', route]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
