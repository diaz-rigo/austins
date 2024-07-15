import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/core/services/session.service';
import { UserProfile } from 'src/app/shared/models/userPROFILE.model';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user: UserProfile | undefined;
  selectedFile: File | null = null;

  constructor(
    private profileService: ProfileService,
    private sessionService: SessionService,
    private http: HttpClient
  ) {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.fetchUserData(userData.id);
    }
  }

  fetchUserData(userId: string) {
    this.profileService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadProfilePhoto();
  }

  uploadProfilePhoto() {
    if (this.selectedFile && this.user) {
      const formData = new FormData();
      formData.append('profilePhoto', this.selectedFile, this.selectedFile.name);

      this.http.post(`${environment.api}/perfil/upload-image-profile`, formData)
        .subscribe(
          (response: any) => {
            console.log(response);
            if (this.user) {
              // Actualiza la foto de perfil en el objeto usuario y en la base de datos
              this.user.profilePhoto = response.image; // Ajusta según la respuesta de tu backend
              this.profileService.updateProfilePhoto(this.user._id, response.image)
                .subscribe(
                  () => {
                    console.log('URL de foto de perfil actualizada en la base de datos');
                    // Guarda la fecha actual en localStorage
                    const currentDate = new Date().toISOString();
                    localStorage.setItem('lastProfileUpdate', currentDate);
                  },
                  (error) => {
                    console.error('Error al actualizar URL de foto de perfil en la base de datos:', error);
                  }
                );
            }
          },
          (error) => {
            console.error('Error al subir la foto de perfil:', error);
          }
        );
    }
  }

  canEditProfile(): boolean {
    // Verifica si han pasado más de 60 días desde la última actualización
    const lastUpdate = localStorage.getItem('lastProfileUpdate');
    if (!lastUpdate) {
      return true; // Si no hay fecha guardada, permite la edición
    }
    
    const currentDate = new Date();
    const lastUpdateDate = new Date(lastUpdate);
    const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 60; // Permitir la edición si han pasado más de 60 días
  }

  getDaysSinceLastUpdate(): number {
    const lastUpdate = localStorage.getItem('lastProfileUpdate');
    if (!lastUpdate) {
      return 0; // Si no hay fecha guardada, retorna 0 días
    }
    
    const currentDate = new Date();
    const lastUpdateDate = new Date(lastUpdate);
    const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  updateUserData() {
    // Implementa la lógica para actualizar los datos del usuario aquí
  }
}
