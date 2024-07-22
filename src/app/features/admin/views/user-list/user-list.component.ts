import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../commons/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  admins: any[] = [];
  clients: any[] = [];
  isWeb = true;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.admins = data.filter((user: { rol: string; }) => user.rol === 'ADMIN');
      this.clients = data.filter((user: { rol: string; }) => user.rol === 'CLIENT');
      // console.log('Admins:', this.admins);
      // console.log('Clients:', this.clients);
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isWeb = window.innerWidth > 768;
  }
  editUser(user: any): void {
    // Lógica para editar el usuario
    console.log('Edit user:', user);
  }

  deleteUser(id: string): void {
    // this.userService.deleteUser(id).subscribe(() => {
    //   this.admins = this.admins.filter(u => u._id !== id);
    //   this.clients = this.clients.filter(u => u._id !== id);
    //   console.log('User deleted:', id);
    // });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      case 'Pendiente':
        return 'warning';
      default:
        return '';
    }
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getRandomColor(seed: string): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1'];
    const hash = this.hashString(seed);
    return colors[hash % colors.length];
  }

  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
