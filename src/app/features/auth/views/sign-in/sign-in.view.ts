import { Component, OnInit } from '@angular/core'
import { ISingInRequest } from '../../interfaces/sign-in-request.interface'
import { SignInService } from '../../commons/services/sign-in.service'
import { StorageService } from 'src/app/core/services/storage.service'
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, finalize } from 'rxjs/operators'
import { throwError } from 'rxjs'
// import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { SessionService } from 'src/app/core/services/session.service'
import { ERol } from 'src/app/shared/constants/rol.enum'
import { MessageService } from 'primeng/api'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { NotificService } from 'src/app/shared/services/notific.service'
import { SwPush } from '@angular/service-worker'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.view.html',
  styleUrls: ['./sign-in.view.scss'],
  providers: [MessageService],
})
export class SignInView implements OnInit {
  errorMessage!: string // Define la variable para almacenar el mensaje de error
  userROL!: string
  loginAttempts: number = 0 // Variable para almacenar el número de intentos de inicio de sesión fallidos
  ref: DynamicDialogRef | undefined
  // constructor(private ngxService: NgxUiLoaderService) {}
  readonly VAPID_PUBLIC_KEY =
    'BFYtOg9-LQWHmObZKXm4VIV2BImn5nBrhz4h37GQpbdj0hSBcghJG7h-wldz-fx9aTt7oaqKSS3KXhA4nXf32pY'
  subscribeToNotifications(userId: string) {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        // console.log('Token de suscripción:', sub.toJSON())
        // Enviar la suscripción al backend
        this.pushNotificationService.sendSubscription2(sub.toJSON() ,userId).subscribe(
          (res) => console.log('Suscripción enviada al servidor:', res),
          (error) =>
            console.error('Error al enviar la suscripción al servidor:', error),
        )
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err),
      )
  }
  constructor(
    private pushNotificationService: NotificService,
    private swPush: SwPush,
    private ngxService: NgxUiLoaderService,
    private snackBar: MatSnackBar, // Inyecta MatSnackBar
    private signInService: SignInService,
    private storageService: StorageService,
    private router: Router,
    private sessionService: SessionService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef, // private dialogRef: MatDialogRef<SignInView> // Inyecta MatDialogRef
  ) {}

  ngOnInit(): void {}
  signIn(data: ISingInRequest): void {
    if (!data) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Datos requeridos',
      })
      return
    }

    this.ngxService.start()

    this.signInService
      .signIn(data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error.message || 'Error en la solicitud'
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage,
          })
          this.loginAttempts++
          return throwError(this.errorMessage)
        }),
        finalize(() => {
          this.ngxService.stop()
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.storageService.setToken(response.token)
          const userData = this.sessionService.getUserData()
          if (userData) {
            // this.subscribeToNotifications(userData.id)
            this.userROL = userData.rol
            if (this.userROL === ERol.ADMIN) {
              this.router.navigateByUrl('/admin')
            } else if (this.userROL === ERol.CLIENT) {
              this.router.navigate(['/']).then(() => {
                window.location.reload()
              })
            }
            this.dialogRef.close()
          }
        }
      })
  }
}
