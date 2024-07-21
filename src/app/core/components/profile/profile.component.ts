import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/core/services/session.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from 'src/app/shared/models/userPROFILE.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user: UserProfile | undefined;
  selectedFile: File | null = null;
  isEditing: any = {
    postalCode: false,
    securityQuestion: false,
    securityAnswer: false,
    phone: false,
    address: false,
  };
  profileForm: FormGroup;
  mostrarpostalCode: boolean = false;
  mostrarnombre: boolean = false;
  mostrarpaternalLastname: boolean = false;
  mostrarmaternalLastname: boolean = false;
  mostrarphone: boolean = false;
  mostrarcountry: boolean = false;
  mostrarcity: boolean = false;
  mostraraddress: boolean = false;
  mostrardateOfBirth: boolean = false;
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private http: HttpClient
  ) {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.fetchUserData(userData.id);
    }

    // Inicializa el formulario reactivo con validaciones
    this.profileForm = this.fb.group({
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      name: ['', Validators.required],
      paternalLastname: ['', Validators.required],
      maternalLastname: [''],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      dateOfBirth: ['']
    });
  }

  updateFormValues() {
    if (this.user) {
      this.profileForm.patchValue({
        postalCode: this.user.postalCode,
        name: this.user.name,
        paternalLastname: this.user.paternalLastname,
        maternalLastname: this.user.maternalLastname,
        phone: this.user.phone,
        address: this.user.address,
        city: this.user.city,
        country: this.user.country,
        dateOfBirth: this.user.dateOfBirth
      });
    }
  }

  fetchUserData(userId: string) {
    this.profileService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
        this.mostrarpostalCode = this.user.postalCode != null;
        this.mostrarnombre = this.user.name != null;
        this.mostrarpaternalLastname = this.user.paternalLastname != null;
        this.mostrarmaternalLastname = this.user.maternalLastname != null;
        this.mostrarphone = this.user.phone != null;
        this.mostrarcountry = this.user.country != null;
        this.mostrarcity = this.user.city != null;
        this.mostraraddress = this.user.address != null;
        this.mostrardateOfBirth = this.user.dateOfBirth != null;
        this.updateFormValues();
        console.log(this.user)
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
            if (this.user) {
              this.user.profilePhoto = response.image;
              this.profileService.updateProfilePhoto(this.user._id, response.image)
                .subscribe(
                  () => {
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
    const lastUpdate = localStorage.getItem('lastProfileUpdate');
    if (!lastUpdate) {
      return true;
    }

    const currentDate = new Date();
    const lastUpdateDate = new Date(lastUpdate);
    const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 60;
  }

  getDaysSinceLastUpdate(): number {
    const lastUpdate = localStorage.getItem('lastProfileUpdate');
    if (!lastUpdate) {
      return 0;
    }

    const currentDate = new Date();
    const lastUpdateDate = new Date(lastUpdate);
    const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  updateUserData() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      if (this.user) {
        this.profileService.updateUserProfile(this.user._id, updatedData)
          .subscribe(
            () => {
              this.showForm=false
              this.fetchUserData(this.user!._id);
            },
            (error) => {
              console.error('Error al actualizar datos del usuario:', error);
            }
          );
      }
    }
  }
  editar() {
    this.mostrarpostalCode = false;
    this.mostrarnombre = false;
    this.mostrarpaternalLastname = false;
    this.mostrarmaternalLastname = false;
    this.mostrarphone = false;
    this.mostraraddress = false;
    this.mostrarcity = false;
    this.mostrarcountry = false;
    this.mostrardateOfBirth = false;
    this.showForm=true
  }
  checkMissingFields() {
    if (this.user) {
      this.showForm = !(
        this.user.postalCode &&
        this.user.name &&
        this.user.paternalLastname &&
        this.user.maternalLastname &&
        this.user.phone &&
        this.user.address &&
        this.user.city &&
        this.user.country &&
        this.user.dateOfBirth
      );
    }
  }
}
