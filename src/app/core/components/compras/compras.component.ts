import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { SessionService } from '../../services/session.service';
import { UserProfile } from 'src/app/shared/models/userPROFILE.model';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  // userId: string = '6694467053f39eebd83990e3'; // ID del usuario
  compras: any[] = [];
  user: UserProfile | undefined;
  constructor(private comprasService: ProfileService,
    private sessionService: SessionService,) {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.fetchUserData(userData.id);
      this.comprasService.getCompras(userData.id).subscribe(
        (data) => {
          this.compras = data;
        },
        (error) => {
          console.error('Error al obtener las compras:', error);
        }
      );
    }
  }
  fetchUserData(userId: string) {
    this.comprasService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
  ngOnInit(): void {
    
  }
}
