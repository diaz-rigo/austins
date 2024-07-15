import { Component, OnInit } from '@angular/core'
import { StorageService } from './core/services/storage.service'
import { Router, NavigationEnd } from '@angular/router'
// import AOS from 'aos';
import * as AOS from 'aos'
import { SwPush } from '@angular/service-worker'
import { NotificService } from './shared/services/notific.service'
import { PedidoviewService } from './shared/services/pedidoview.service'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ConfirmationService, MessageService } from 'primeng/api'
import { OrderviewView } from './features/payment/views/orderview/orderview.view'
import { CartService } from './core/services/cart.service'
import { DialogRefService } from './shared/services/dialog-ref.service'
import { SessionService } from './core/services/session.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class AppComponent implements OnInit {
  title = 'austins'
  badge: number = 0
  respuesta: any
  currentRoute!: string
  ref: DynamicDialogRef | undefined
  initialReloadDone = false

  readonly VAPID_PUBLIC_KEY =
    'BFYtOg9-LQWHmObZKXm4VIV2BImn5nBrhz4h37GQpbdj0hSBcghJG7h-wldz-fx9aTt7oaqKSS3KXhA4nXf32pY'

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        // console.log('Token de suscripción:', sub.toJSON())
        // Enviar la suscripción al backend
        this.pushNotificationService.sendSubscription(sub.toJSON()).subscribe(
          (res) => console.log('Suscripción enviada al servidor:', res),
          (error) =>
            console.error('Error al enviar la suscripción al servidor:', error),
        )
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err),
      )
  }
  subscribeToNotifications2(userId: string) {
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
    private sessionService: SessionService,
    private pedidoviewService: PedidoviewService,
    private pushNotificationService: NotificService,
    private swPush: SwPush,
    //  private newsletterService: NewsletterService,
    private storageService: StorageService,
    private router: Router,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cartService: CartService,    private dialogRefService: DialogRefService // Inyectar el servicio

  ) {
    const userData = this.sessionService.getUserData()
    if (userData) {
      this.subscribeToNotifications2(userData.id)
    }
    this.subscribeToNotifications()
    // Suscribirse a los cambios de la ruta y redirigir en caso de rutas no válidas
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.router.url.includes('/portal/not-found') &&
          !this.router.url.includes('/portal/home')
        ) {
          // Redirigir a la página de error si estamos en una ruta no válida
          this.router.navigateByUrl('portal/not-found')
        }
      }
    })
  }
  ngOnInit(): void {
    AOS.init()
    window.addEventListener('load', AOS.refresh)


  }

  isChatOpen = false

  toggleChat(isOpen: boolean) {
    this.isChatOpen = isOpen
  }
  isRUTA_DISTINTE_ahome(): boolean {
    // Utiliza el evento de cambio de ruta para actualizar 'currentRoute'
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
        // Llamamos a la función que manejará la visibilidad de la sección de filtros
      }
    })

    // Ahora verifica si la ruta actual es '/portal/home'
    return this.currentRoute === '/portal/home'
  }
  showDialog() {
    const isMobile = window.innerWidth < 480;
    this.dialogRefService.setDialogRef( // Usar el servicio para almacenar la referencia
      this.dialogService.open(OrderviewView, {
        header: 'Otro diseño',
        height: isMobile ? 'auto' : 'auto',
        style: {
          'max-width': isMobile ? '110vw' : 'auto',
          'max-height': isMobile ? 'auto' : '100vh',
          padding: '0',
        },
        modal: true,
        breakpoints: {
          '960px': '75vw',
          '640px': '100vw',
        },
        data: {},
      })
    );
  }
}
