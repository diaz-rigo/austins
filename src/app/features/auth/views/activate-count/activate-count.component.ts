import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// Importaciones específicas de PrimeNG
import { MessageService } from 'primeng/api'; // Servicio de mensajes de PrimeNG
import { ConfirmationService } from 'primeng/api'; // Servicio de confirmación de PrimeNG
import { PasswordModule } from 'primeng/password'; // Módulo de campo de contraseña de PrimeNG

@Component({
  selector: 'app-activate-count',
  templateUrl: './activate-count.component.html',
  styleUrls: ['./activate-count.component.scss'],
  providers: [MessageService, ConfirmationService] // Proveedores de servicios de PrimeNG
})
export class ActivateCountComponent implements OnInit {
  token: string = '';
  error: string = '';
  activateAccountForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,  private router: Router,

  ) {
    this.activateAccountForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.token = token;
        // console.log('Token recibido:', this.token);
      } else {
        // console.log('No se recibió token');
      }
    });
  }

  passwordMatchValidator(control: FormControl): { [key: string]: any } | null {
    const password = this.activateAccountForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMatch: true };
  }

  onConfirmPasswordInput(event: Event) {
    const confirmInput = event.target as HTMLInputElement;
    const confirmPasswordControl = this.activateAccountForm.get('confirmPassword');

    if (confirmPasswordControl) {
      const password = this.activateAccountForm.get('password')?.value;
      const confirmPassword = confirmInput.value;

      if (password === confirmPassword) {
        confirmPasswordControl.setErrors(null);
      } else {
        confirmPasswordControl.setErrors({ passwordMatch: true });
      }
    }
  }


  activateAccount() {
    if (this.activateAccountForm.valid) {
      const password = this.activateAccountForm.get('password')?.value;
      this.http.post<any>(`${environment.api}/auth/activate`, { token: this.token, password })
        .subscribe(
          () => {

            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: '¡Cuenta activada correctamente!' });
            // this.router.navigate(['/portal/home']);
            this.router.navigateByUrl('/home' ).then(() => {
              window.location.reload()
            })
          },
          (error: HttpErrorResponse) => {
            if (error.error && error.error.error) {
              this.error = error.error.error;
            } else {
              this.error = error.error || 'Error al activar la cuenta.';
            }
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
          }
        );
    } else {
      this.activateAccountForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar mensajes de error
    }
  }
}
