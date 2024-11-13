import { Component, Output, EventEmitter } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-form-feedback',
  templateUrl: './form-feedback.component.html',
  styleUrls: ['./form-feedback.component.scss']
})
export class FormFeedbackComponent {
  easeOfUse: number = 0;
  satisfaction: number = 0;
  npsScore: number = 0;

  @Output() surveySubmitted = new EventEmitter<void>(); // Evento para notificar al componente padre

  constructor(private feedbackService: FeedbackService) {}

  submitSurvey() {
    // Acceder a 'purchaseData' desde localStorage y parsearlo a JSON
    const purchaseData = JSON.parse(localStorage.getItem('purchaseData') || '{}');

    // Preparar el objeto para enviar solo los datos necesarios
    const feedbackData = {
      datosCliente: {
        name: purchaseData.datoscliente?.name || '',
        email: purchaseData.datoscliente?.email || ''
      },
      npsScore: this.npsScore,
      easeOfUse: this.easeOfUse,
      satisfaction: this.satisfaction
    };

    // Llamar al servicio para enviar los datos a la API
    this.feedbackService.sendFeedback(feedbackData).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('¡Feedback enviado exitosamente!');
        this.surveySubmitted.emit(); // Emitir evento para el componente padre
      },
      error: (error) => {
        console.error('Error al enviar feedback:', error);
        alert('Hubo un error al enviar el feedback.');
      }
    });
  }
}
