import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { SignInValidator } from 'src/app/shared/validators/sign-in-validator'
import { SignUpValidator } from 'src/app/shared/validators/sign-up-validator'
import { AuthService } from '../../services/auth.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { MenuItem, MessageService } from 'primeng/api'
import { catchError, finalize, throwError } from 'rxjs'
import { NgxUiLoaderService } from 'ngx-ui-loader'

// import AOS from "aos";
interface City {
  name: string
}
@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: [
    './password-input.component.scss',
    './sign-up-form.component.scss',
    './materror.component.scss',
    './form-up.component.scss',
    './up.scss',
    './up02.scss',
    './up03.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpFormComponent implements OnInit {
  siteKey: string
  passwordVisible1: boolean = false
  passwordVisible2: boolean = false
  passwordFieldType1: string = 'password'
  passwordFieldType2: string = 'password'
  termsAccepted: boolean = false
  recaptchaValid = false
  items: MenuItem[] = [
    { label: 'personal' },
    { label: 'contact' },
    { label: 'credentials' },
  ]
  activeIndex = 0
  userTouchedForm = false

  breadcrumbItems = [
    {
      label: 'Inicio',
      command: () => {
        this.redirectToHome('home')
      },
    },
    { label: 'Sign-up', routerLink: '/signup', target: '_self' },
  ]

  preguntapregunta: City | undefined
  isSubmitting = false
  group: FormGroup
  step: 'personal' | 'contact' | 'credentials' = 'personal'
  preguntasSecretas: string[] = [
    '¿Cuál es tu color favorito?',
    '¿Cuál es el nombre de tu mascota?',
    '¿En qué ciudad naciste?',
  ]
  constructor(
    private ngxService: NgxUiLoaderService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private messageService: MessageService,
  ) {
    const signInValidator = new SignInValidator()
    const signUpValidator = new SignUpValidator()
    // this.siteKey = '6Lc3YmEpAAAAAO6t_Qmv-NeqUApr2AJFPbnIhSeU'; localhost
    // this.siteKey = '6Lc3YmEpAAAAAO6t_Qmv-NeqUApr2AJFPbnIhSeU';

    // this.siteKey = '6LcUCGIpAAAAANGNeryg6jvmWdcJagZ7-34PY5IY'; produccion
    this.siteKey = '6LcUCGIpAAAAANGNeryg6jvmWdcJagZ7-34PY5IY'
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    this.group = this.formBuilder.group({
      name: [''],
      maternalLastname: [''],
      paternalLastname: [''],
      birthdate: [''],
      email: [''],
      securityQuestion: [''],
      securityAnswer: [''],
      phone: [''],
      password: [''],
      confirmPassword: [''],
      recaptcha: [''],
      priv: [''],
    })
  }

  nextStep(targetStep: 'personal' | 'contact' | 'credentials') {
    // Actualizar el índice activo
    this.activeIndex = ['personal', 'contact', 'credentials'].indexOf(
      targetStep,
    )
    const event = new CustomEvent('formStepChange', {
      detail: { step: targetStep },
      bubbles: true,
    })
    document.dispatchEvent(event)
    this.step = targetStep // Agregar esta línea para mantener la propiedad 'step' actualizada
  }

  prevStep() {
    if (this.step === 'contact') {
      this.step = 'personal'
    } else if (this.step === 'credentials') {
      this.step = 'contact'
    }
    const event = new CustomEvent('formStepChange', {
      detail: { step: this.step },
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  private applyValidatorsAfterInteraction() {
    const fieldsToValidate = [
      'name',
      'maternalLastname',
      'paternalLastname',
      'birthdate',
      'email',
      'securityQuestion',
      'securityAnswer',
      'recaptcha',
      'phone',
      'password',
      'confirmPassword',
      'priv',
    ]
    fieldsToValidate.forEach((fieldName) => {
      this.applyValidatorsForField(fieldName)
    })
  }

  ngOnInit() {
    this.group.valueChanges.subscribe(() => {
      this.userTouchedForm = true
      if (this.userTouchedForm) {
        // console.log("click")
        this.applyValidatorsAfterInteraction()
      }
    })
    this.securityQuestionFormControl.valueChanges.subscribe(() => {
      this.onSecurityQuestionChange()
    })
  }
  // handleRecaptchaValidation(event: any): void {
  handleSuccess(event: any): void {
    this.recaptchaValid = event ? true : false

    // if (this.group.valid && !this.isSubmitting) {
    if (this.recaptchaValid) {
      this.applyValidatorsAfterInteraction()
      const control1 = this.group.get('priv')
      if (control1) {
        control1.updateValueAndValidity({ onlySelf: true, emitEvent: false })
      } else {
        console.error("El control 'priv' no fue encontrado en el FormGroup.")
      }
      const control2 = this.group.get('recaptcha')
      if (control2) {
        control2.updateValueAndValidity({ onlySelf: true, emitEvent: false })
      } else {
        console.error("El control 'priv' no fue encontrado en el FormGroup.")
      }

      console.log(this.recaptchaValid)
      // this.isSubmitting = true;
    }
    // this.isSubmitting = true;
    Object.keys(this.group.controls).forEach((key) => {
      const controlErrors = this.group.get(key)?.errors
      if (controlErrors != null || controlErrors != undefined) {
        // console.log(controlErrors);
        // this.isSubmitting = true;

        this.group.markAllAsTouched()
        // console.log('reCAPTCHA success:', controlErrors)
        if (controlErrors['required'] != true) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              controlErrors['formatError'] ||
              controlErrors['invalidDate'] ||
              controlErrors['invalidLastName'] ||
              controlErrors['invalidName'],
          })

          this.snackBar.open(
            `Error en el campo ${key}:` + controlErrors['formatError'] ||
              controlErrors['invalidDate'] ||
              controlErrors['invalidLastName'] ||
              controlErrors['invalidName'],
            'Cerrar',
            {
              duration: 3000,
            },
          )
        }
      }
    })
  }

  togglePasswordVisibility1() {
    this.passwordVisible1 = !this.passwordVisible1
    this.passwordFieldType1 = this.passwordVisible1 ? 'text' : 'password'
  }

  togglePasswordVisibility2() {
    this.passwordVisible2 = !this.passwordVisible2
    this.passwordFieldType2 = this.passwordVisible2 ? 'text' : 'password'
  }
  private applyValidatorsForField(fieldName: string) {
    const control = this.group.get(fieldName)
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    if (control && control.dirty && control.touched) {
      // Check if the control is both dirty and touched
      switch (fieldName) {
        case 'name':
          control.setValidators([
            Validators.required,
            SignUpValidator.isValidName,
          ])
          break
        case 'maternalLastname':
          control.setValidators([
            Validators.required,
            SignUpValidator.isValidLastName,
          ])
          break
        case 'paternalLastname':
          control.setValidators([
            Validators.required,
            SignUpValidator.isValidLastName,
          ])
          break
        case 'birthdate':
          control.setValidators([
            Validators.required,
            SignUpValidator.isValidDate,
          ])
          break
        case 'email':
          control.setValidators([
            Validators.required,
            Validators.pattern(emailRegex),
          ])
          break
        case 'securityQuestion':
          control.setValidators(Validators.required)
          break
        case 'securityAnswer':
          control.setValidators(Validators.required)
          break
        case 'password':
          control.setValidators([
            Validators.required,
            SignInValidator.formatPassword,
          ])
          break
        case 'confirmPassword':
          control.setValidators([
            Validators.required,
            this.passwordMatchValidator.bind(this),
          ])
          break
        case 'recaptcha':
          control.setValidators([Validators.required])
          break
        case 'priv':
          control.setValidators([Validators.required])
          break
        case 'phone':
          control.setValidators([
            Validators.required,
            SignUpValidator.formatPhone,
          ])
          break
        // Add cases for other fields as needed
      }
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false })
    }
  }

  passwordMatchValidator(control: FormControl): ValidationErrors | null {
    const password = control.get('password')?.value
    const confirmPassword = control.get('confirmPassword')?.value

    return password === confirmPassword ? null : { passwordMatch: true }
  }

  onConfirmPasswordInput(event: Event) {
    const confirmInput = event.target as HTMLInputElement
    const confirmPasswordControl = this.group.get('confirmPassword')

    if (confirmPasswordControl) {
      const password = this.group.get('password')?.value
      const confirmPassword = confirmInput.value

      if (password === confirmPassword) {
        confirmPasswordControl.setErrors(null)
      } else {
        confirmPasswordControl.setErrors({ passwordMatch: true })
      }
    }
  }

  get nameFormControl(): FormControl {
    return this.group.get('name') as FormControl
  }

  get a1(): FormControl {
    return this.group.get('maternalLastname') as FormControl
  }

  get a2(): FormControl {
    return this.group.get('paternalLastname') as FormControl
  }

  get emailFormControl(): FormControl {
    return this.group.get('email') as FormControl
  }

  get passwordFormControl(): FormControl {
    return this.group.get('password') as FormControl
  }

  get confirmPasswordFormControl(): FormControl {
    return this.group.get('confirmPassword') as FormControl
  }

  get phoneFormControl(): FormControl {
    return this.group.get('phone') as FormControl
  }

  get securityQuestionFormControl(): FormControl {
    return this.group.get('securityQuestion') as FormControl
  }

  get securityAnswerFormControl(): FormControl {
    return this.group.get('securityAnswer') as FormControl
  }

  get recaptchaFormControl(): FormControl {
    return this.group.get('recaptcha') as FormControl
  }
  get privFormControl(): FormControl {
    return this.group.get('priv') as FormControl
  }

  onSecurityQuestionChange() {
    this.securityAnswerFormControl.reset('')
  }

  onPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement
    const phoneControl = this.group.get('phone')

    if (phoneControl) {
      const maxLength = 10
      const trimmedValue = inputElement.value.slice(0, maxLength)

      inputElement.value = trimmedValue
      phoneControl.setValue(trimmedValue)
    }
  }

  onSubmit() {
    this.markAllControlsAsTouched()
    this.displayControlErrors()

    if (this.group.valid && !this.isSubmitting) {
      this.isSubmitting = true

      if (this.termsAccepted && this.recaptchaValid) {
        this.registerUser()
      } else {
        this.displayControlErrors()

        // No se cumplen los requisitos para el envío del formulario
        if (!this.termsAccepted) {
          this.snackBar.open(
            'Para continuar, por favor acepta los términos y condiciones',
            'Cerrar',
            { duration: 3000 },
          )
          // this.showError("Para continuar, por favor acepta los términos y condiciones.");
        }
        if (!this.recaptchaValid) {
          this.snackBar.open('Por favor completa el reCAPTCHA', 'Cerrar', {
            duration: 3000,
          })
          // this.showError("Por favor completa el reCAPTCHA.");
        }
        this.isSubmitting = false // Restaurar el estado de envío
      }
    }
  }

  markAllControlsAsTouched() {
    this.group.markAllAsTouched()
  }

  displayControlErrors() {
    Object.keys(this.group.controls).forEach((key) => {
      const controlErrors = this.group.get(key)?.errors
      if (controlErrors) {
        const errorMessage =
          controlErrors['formatError'] ||
          controlErrors['invalidDate'] ||
          controlErrors['invalidLastName'] ||
          controlErrors['invalidName']
        // console.log(controlErrors)
        // this.showError(`Error en el campo ${key}: ${errorMessage}`);
      }
    })
  }

  updateControlValidity(controlName: string) {
    const control = this.group.get(controlName)
    if (control) {
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false })
    } else {
      console.error(
        `El control '${controlName}' no fue encontrado en el FormGroup.`,
      )
    }
  }

  // registerUser() {
  //   this.authService.signUpAndVerifyEmail(this.group.value).subscribe(
  //     response => {
  //       this.handleSuccessResponse(response);
  //     },
  //     error => {
  //       this.handleErrorResponse(error);
  //     }
  //   ).add(() => {
  //     this.isSubmitting = false;
  //   });
  // }
  registerUser() {
    this.isSubmitting = true
    this.ngxService.start() // Inicia el spinner

    this.authService
      .signUpAndVerifyEmail(this.group.value)
      .pipe(
        catchError((error) => {
          this.handleErrorResponse(error)
          return throwError(error)
        }),
        finalize(() => {
          this.isSubmitting = false
          this.ngxService.stop() // Detiene el spinner al finalizar la solicitud
        }),
      )
      .subscribe((response) => {
        this.handleSuccessResponse(response)
      })
  }
  handleSuccessResponse(response: any) {
    this.snackBar.open(response.message, 'Cerrar', { duration: 3000 })
    this.messageService.add({
      key: 'bc',
      severity: 'success',
      summary: 'Success',
      detail: response.message,
    })
    this.router.navigate([
      '/auth/user-create',
      { userEmail: this.group.value.email },
    ])
  }

  handleErrorResponse(error: any) {
    const errorMessage = error.error.message || 'Error en el servidor'
    this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 })
    this.showError(errorMessage)
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    })
  }

  ////
  arePersonalFieldsFilled(): boolean {
    return (
      this.group.get('name')?.value &&
      this.group.get('maternalLastname')?.value &&
      this.group.get('paternalLastname')?.value &&
      this.group.get('birthdate')?.value
    )
  }

  areContactFieldsFilled(): boolean {
    return (
      this.group.get('securityQuestion')?.value &&
      this.group.get('securityAnswer')?.value &&
      this.group.get('phone')?.value
    )
  }

  areCredentialFieldsFilled(): boolean {
    return (
      this.group.get('email')?.value &&
      this.group.get('password')?.value &&
      this.group.get('password')?.value &&
      this.group.get('confirmPassword')?.value &&
      this.group.get('recaptcha')?.value &&
      this.group.get('priv')?.value
    )
  }
  redirectToHome(route: string): void {
    this.router.navigateByUrl('/' + route).then(() => {
      window.location.reload()
    })
  }
}
