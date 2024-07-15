import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificService } from 'src/app/shared/services/notific.service';
import { OrderService } from '../../services/order.service';
import { catchError, throwError } from 'rxjs';
import { SessionService } from 'src/app/core/services/session.service';
import { User } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile.service';

interface PasteleriaFlavor {
  name: string;
  code: string;
  precioPorKilo: number; // Agrega el precio por kilo para cada sabor
}
@Component({
  selector: 'app-order-on-session',
  templateUrl: './order-on-session.component.html',
  styleUrl: './order-on-session.component.scss',  providers: [DialogService, ConfirmationService, MessageService],

})
export class OrderOnSessionComponent {

  // Datos del Cliente
  nombre: string | undefined;
  nombre_completo: string | undefined;
  apellido1: string | undefined;
  apellido2: string | undefined;
  correo: string | undefined;
  telefono: string | undefined;

  // Pedido
  selectedFlavor: PasteleriaFlavor | undefined;
  selectedQuantity: number | undefined;
  precioTotal: number | undefined;
  personasPorKilo: number | undefined;

  // Personalización
  color_personalizado: string | undefined;
  design_personalizado: string | undefined;
  selectedModo: string | undefined;
  modoPersonalizado: string | undefined;
  saborpersonalizado: string | undefined;
  mensajePersonalizado: string = '';
  selectedFile!: File;

  // Fecha y Hora de Entrega
  dia: Date | undefined;
  hora: string | undefined;

  // Opciones de Modo y Sabor
  flavors: PasteleriaFlavor[] | undefined;
  modoOptions: string[] = ['cuadrado', 'redondo', 'corazon', 'otro'];
  selectedModosabor: string = '';

  readonly VAPID_PUBLIC_KEY = 'BFYtOg9-LQWHmObZKXm4VIV2BImn5nBrhz4h37GQpbdj0hSBcghJG7h-wldz-fx9aTt7oaqKSS3KXhA4nXf32pY';

  subscribeToNotifications() {
    if (!('serviceWorker' in navigator)) {
      console.error('Service workers are not supported by this browser.');
      return;
    }

    if (!('PushManager' in window)) {
      console.error('Push notifications are not supported by this browser.');
      return;
    }

    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        // Enviar la suscripción al backend
        this.pushNotificationService.sendSubscription(sub.toJSON()).subscribe(
          (res) => console.log('Suscripción enviada al servidor:', res),
          (error) =>
            console.error('Error al enviar la suscripción al servidor:', error),
        );
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err),
      );
  }
  userId: string = ''; // Corrige el tipo de dato aquí
  user: User | undefined;

  constructor(
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private pushNotificationService: NotificService,
    private swPush: SwPush,
    private pedidoService: OrderService,
    private messageService: MessageService,private sessionService: SessionService,  private profileService: ProfileService, 
  ) {

    const userData = this.sessionService.getUserData()

    this.userId =userData?.id|| '';
    if (this.userId) {
      this.fetchUserData();
    }

  }
  fetchUserData() {
    this.profileService.getUserById(this.userId).subscribe(
      (data: User) => {
        this.user = data; // Asigna los datos del usuario obtenidos del servicio
        console.log("----*", this.user)
        this.nombre_completo=`${this.user.name} ${this.user.paternalLastname} ${this.user.maternalLastname}`;
        // this.nombre = `${userData.firstName} ${userData.lastName}`;

      },
      error => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }
  ngOnInit() {
    this.flavors = [
      { name: 'Chocolate', code: 'choco', precioPorKilo: 580 }, // Define el precio por kilo para cada sabor
      { name: 'Vainilla', code: 'vani', precioPorKilo: 380 },
      { name: 'Fresa', code: 'fres', precioPorKilo: 380 },
      { name: 'Limón', code: 'lim', precioPorKilo: 350 },
      { name: 'Naranja', code: 'nara', precioPorKilo: 350 },
    ];
    this.selectedModo = undefined; // Inicializar el modo seleccionado
    this.modoPersonalizado = undefined; // Inicializar el modo personalizado
  }

  kilosOptions: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones de cantidad en kilos

  calcularPrecio(): void {
    if (this.selectedFlavor && this.selectedQuantity) {
      this.precioTotal = this.selectedFlavor.precioPorKilo * this.selectedQuantity;
    } else {
      this.precioTotal = undefined;
    }
    if (this.selectedFlavor !== undefined && this.selectedFlavor !== null) {
      // Limpiar el textarea de sabor
      this.saborpersonalizado = '';
    }
  }

  calcularPersonas(): void {
    if (this.selectedQuantity) {
      this.personasPorKilo = this.selectedQuantity * 25;
    } else {
      this.personasPorKilo = undefined;
    }
    if (this.selectedFlavor !== undefined && this.selectedFlavor !== null) {
      // Limpiar el textarea de sabor
      this.saborpersonalizado = '';
    }
  }

  modoChanged(): void {
    if (this.selectedModosabor === 'otrosabor') {
      // console.log('Se seleccionó otro sabor');
      this.selectedFlavor = undefined; // Limpiar el select de sabores
    }
    if (this.selectedModo !== 'otro') {
      this.modoPersonalizado = undefined;
    }
  }

  getIconClass(modo: string): string {
    // Función para obtener la clase de icono basada en el modo seleccionado
    switch (modo) {
      case 'cuadrado':
        return 'pi pi-stop';
      case 'redondo':
        return 'pi pi-circle';
      case 'corazon':
        return 'pi pi-heart';
      default:
        return '';
    }
  }

  handleFileInput(event: { files: File[] }): void {
    this.selectedFile = event.files[0];
    // console.log(this.selectedFile);
  }

  enviarPedido() {
    // Validar todos los campos obligatorios
    const camposObligatorios = [
      // { campo: this.nombre, mensaje: 'Nombre' },
      // { campo: this.apellido1, mensaje: 'Apellido 1' },
      // { campo: this.apellido2, mensaje: 'Apellido 2' },
      // { campo: this.correo, mensaje: 'Correo' },
      // { campo: this.telefono, mensaje: 'Teléfono' },
      { campo: this.selectedQuantity, mensaje: 'Cantidad' },
      { campo: this.dia, mensaje: 'Día' },
      { campo: this.hora, mensaje: 'Hora' },
      // { campo: this.selectedFile, mensaje: 'imagen' }, por si querem,os que lña imagen sea obligatorio
    ];

    for (const campo of camposObligatorios) {
      if (!campo.campo) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El campo ${campo.mensaje} es obligatorio.`,
        });
        this.ngxLoader.stop();
        return;
      }
    }

    // Validar el formato del correo electrónico
    const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (typeof this.correo === 'string' && !emailPattern.test(this.correo)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingrese un correo electrónico válido.',
      });
      this.ngxLoader.stop();
      return;
    }

    // Validar el número de teléfono
    const phonePattern = /^[0-9]{10}$/;
    if (typeof this.telefono === 'string' && !phonePattern.test(this.telefono)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingrese un número de teléfono válido (10 dígitos numéricos).',
      });
      this.ngxLoader.stop();
      return;
    }

    // Validar que la fecha sea en el futuro
    const currentDate = new Date();
    if (!this.dia || new Date(this.dia) < currentDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor seleccione una fecha futura.',
      });
      this.ngxLoader.stop();
      return;
    }

    // Validar que la hora esté dentro del rango válido
    if (!this.hora) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo Hora es obligatorio.',
      });
      return;
    }

    const selectedTime = new Date(this.hora)
    const minTime = new Date('09:00')
    const maxTime = new Date('20:00')
    if (selectedTime < minTime || selectedTime > maxTime) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor seleccione una hora válida (entre las 09:00 y las 18:00).',
      });
      this.ngxLoader.stop();
      return;
    }

    this.subscribeToNotifications();

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          const p256dhKey = subscription.getKey('p256dh');
          const authKey = subscription.getKey('auth');

          if (!p256dhKey || !authKey) {
            console.error('Las claves p256dh o auth están ausentes en la suscripción.');
            return;
          }

          const subObj = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(p256dhKey),
              auth: this.arrayBufferToBase64(authKey),
            },
          };
          // console.log(subObj);

          const datosSuscripcion = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(p256dhKey),
              auth: this.arrayBufferToBase64(authKey),
            },
          };

          const datosPedido = {
            nombre: this.user?.name,
            apellido1: this.user?.paternalLastname,
            apellido2: this.user?.maternalLastname,
            correo: this.user?.email,
            telefono: this.user?.phone,
            sabor: this.selectedFlavor,
            cantidad: this.selectedQuantity,
            modo: this.selectedModo,
            dia: this.dia,
            hora: this.hora,
            modoPersonalizado: this.modoPersonalizado,
            saborpersonalizado: this.saborpersonalizado,
            decoracion: this.design_personalizado,
            mensajePersonalizado: this.mensajePersonalizado,
            color_personalizado: this.color_personalizado,
            suscripcion: datosSuscripcion,
          };

          this.ngxLoader.start();

          this.pedidoService
            .enviarPedido2(datosPedido)
            .pipe(
              catchError((error) => {
                if (error.status === 409) {
                  console.error('Error al enviar el pedido:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                  });
                } else {
                  console.error('Error al enviar el pedido:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                  });
                  // this.dialogRefService.closeDialog(); // Cerrar el modal usando el servicio
                }
                this.ngxLoader.stop();
                return throwError(error);
              }),
            )
            .subscribe((response: any) => {
              // console.log('Pedido enviado con éxito');
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Pedido enviado con éxito.',
              });

              const pedidoId = response.pedido._id; // Obtener el ID del pedido
              const detallePedidoId = response.pedido.detallePedido[0]._id; // Obtener el ID del detalle del pedido
              this.actualizarImagenPedido(detallePedidoId, response.pedido.codigoPedido); // Llamar a la función para actualizar la imagen del pedido}
              // console.log(response.pedido.codigoPedido);
              // console.log(response);

            });

        } else {
          this.ngxLoader.stop();
          console.error('La suscripción no está disponible.');
        }
      });
    });
  }

  actualizarImagenPedido(pedidoId: string, SEMUYI: string) {
    const formData = new FormData();

    if (this.selectedFile) {
      // this.actualizarImagenPedido(pedidoId, SEMUYI);
      formData.append('imagen', this.selectedFile);
      this.pedidoService.actualizarImagenPedido(pedidoId, formData).subscribe(
        (response: any) => {
          // console.log('Imagen del pedido actualizada:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'La imagen del pedido se ha actualizado correctamente.',
          });
          this.router.navigate(['/payment/order-acc'], { queryParams: { SEMUYI: SEMUYI } });
          this.ngxLoader.stop();
        },
        (error) => {
          console.error('Error al actualizar la imagen del pedido:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la imagen del pedido.',
          });
        },
      );
    }
    this.router.navigate(['/payment/order-acc'], { queryParams: { SEMUYI: SEMUYI } });
    this.ngxLoader.stop();
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  validarHora() {
    const horaSeleccionada = new Date('2024-01-01T' + this.hora);
    const horaMinima = new Date('2024-01-01T08:00');
    const horaMaxima = new Date('2024-01-01T22:00');

    if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima) {
      alert('La hora seleccionada no está dentro del rango permitido (8:00 am - 10:00 pm).');
      this.hora = ''; // Limpiar el input
    }
  }
}
