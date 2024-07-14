// profile.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/core/services/session.service';
import { User } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userId: string = ''; // Corrige el tipo de dato aquí
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,    private sessionService: SessionService,
  ) {
    const userData = this.sessionService.getUserData()
    // console.log(userData)
    // this.userId = this.route.snapshot.paramMap.get('id') || ''; // Obtiene el ID del usuario de los parámetros de la ruta
    this.userId =userData?.id|| '';
    if (this.userId) {
      this.fetchUserData();
    }
   }

  // ngOnInit(): void {

  // }

  fetchUserData() {
    this.profileService.getUserById(this.userId).subscribe(
      (data: User) => {
        this.user = data; // Asigna los datos del usuario obtenidos del servicio
        // console.log(this.user)
        // console.log(this.user.address)
      },
      error => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
}
