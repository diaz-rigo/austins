  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { environment } from 'src/environments/environment';
  import { MessageService } from 'primeng/api';
  import { DialogRefService } from 'src/app/shared/services/dialog-ref.service';
  import { NgxUiLoaderService } from 'ngx-ui-loader';

  @Component({
    selector: 'app-activate-account',
    templateUrl: './activate-count-by-home.component.html',
    styleUrls: ['./activate-count-by-home.component.scss'],
    providers: [MessageService]
  })
  export class ActivateCountByHomeComponent {
    activateAccountForm: FormGroup;
    error: string | null = null;
    success: string | null = null;
    showRecoverLink: boolean = false;
    showRegister: boolean = false;

    constructor(private fb: FormBuilder, private http: HttpClient,private dialogRefService:DialogRefService, private ngxLoader: NgxUiLoaderService,
                private messageService: MessageService) {
      this.activateAccountForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }

    activateAccount() {
      if (this.activateAccountForm.valid) {
        const email = this.activateAccountForm.get('email')?.value;
        const body = { email };
        this.ngxLoader.start();
        this.http.post(`${environment.api}/auth/send-activation-email`, body)
          .subscribe(
            (res: any) => {
              this.error = null;
              this.success = 'Correo de activación enviado correctamente';
              this.showRecoverLink = false;
              console.log('Correo de activación enviado correctamente');
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Correo de activación enviado correctamente',
                life: 2000 // 2000 milisegundos = 2 segundos
              });
              this.ngxLoader.stop();

              // Mostrar el mensaje durante 2 segundos antes de cerrar el diálogo
              setTimeout(() => {
                this.dialogRefService.closeDialog();
              }, 8000); // 2000 milisegundos = 2 segundos
            },
            (error: HttpErrorResponse) => {
              if (error.status === 404) {
                this.error = 'El correo electrónico no está registrado o no está en estado inactivo.';
                this.showRegister = true;
              } else if (error.status === 400) {
                this.error = 'El usuario ya tiene una contraseña establecida. Si ha olvidado su contraseña, por favor recupérala.';
                this.showRecoverLink = true;
              } else {
                this.error = error.error.message || 'Error al activar la cuenta.';
                this.showRecoverLink = false;
              }
              this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error || undefined });
              this.ngxLoader.stop();
            }
          );
      }
    }
    hideActivationForm() {
    this.dialogRefService.closeDialog()
    }
  }
