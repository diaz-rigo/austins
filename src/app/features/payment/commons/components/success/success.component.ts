import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-success-form',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss', './scce.scss'],
})
export class SuccessComponent implements OnInit {
  feedbackVisible = false; // Control de visibilidad del modal de feedback
  token: string = '';
  thanksModalVisible = false; // Control de visibilidad del modal de agradecimiento

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    if (window.location.pathname === '/payment/order-success') {
      this.token = this.route.snapshot.queryParamMap.get('token') || '';

      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            const subObj = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
                auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
              },
            };
            this.orderService.updateOrderStatus(this.token, subObj).subscribe(
              (response) => {
           
              },
              (error) => {
                console.error('Error al actualizar el estado del pedido:', error);
              }
            );
          }
        });
      });

      // Verificar si el usuario ya ha dado feedback y mostrar el modal tras un tiempo si no
      const feedbackGiven = localStorage.getItem('feedbackGiven');
      if (!feedbackGiven) {
        setTimeout(() => {
          this.feedbackVisible = true;
        }, 5000); // Tiempo de espera en ms antes de mostrar el modal
      }
    }
  }

  // Método para convertir ArrayBuffer a base64
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Cerrar el modal sin dar feedback
  closeFeedbackModal(): void {
    this.feedbackVisible = false;
    localStorage.removeItem('carrito');
    localStorage.removeItem('purchaseData');
    localStorage.setItem('feedbackGiven', 'true'); // Guardar que el feedback fue mostrado
  }

  // Enviar el feedback y cerrar el modal
  submitFeedback(): void {
    this.feedbackVisible = false;
    this.thanksModalVisible = true; // Mostrar modal de agradecimiento
    localStorage.setItem('feedbackGiven', 'true'); // Guardar que el feedback fue enviado
    localStorage.removeItem('carrito');
    localStorage.removeItem('purchaseData');
    setTimeout(() => {
      this.thanksModalVisible = false; // Ocultar modal de agradecimiento
      this.router.navigate(['/home']); // Redirigir al inicio
    }, 5000); // Tiempo en milisegundos para redirigir
  }

  // handleSurveySubmit() {
  //   // Guardar la respuesta de la encuesta en el local storage
  //   localStorage.setItem('surveyAnswered', 'true');
  //   this.visible = false; // Cerrar el modal
  // }
}
