import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import OpenAI from 'openai';
import { TokenService } from 'src/app/shared/services/token.service';

// Define el tipo de mensajes de chat esperados por la API de OpenAI
interface ChatCompletionRequestMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', './floating.scss'],
  animations: [
    trigger('dialogFadeInOut', [
      state('void', style({ transform: 'scale(0)', opacity: 0 })),
      transition(':enter', [
        animate(
          '1000ms ease-in',
          style({
            transform: 'scale(1)',
            opacity: 1,
            scroll: -10,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '1000ms ease-out',
          style({ transform: 'scale(0.5)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('floatingButtonAttention', [
      state('normal', style({})),
      state(
        'attention',
        style({
          animation: '2s infinite alternate attention',
        })
      ),
    ]),
  ],
})
export class ChatComponent {
  userMessage: string = '';
  chatHistory: any[] = [];
  floatingButtonState = 'normal';
  openaiInstance: OpenAI | undefined;
  retryCount: number = 0;
  maxRetries: number = 5;

  message!: string;
  constructor(private tokenService: TokenService) {
    this.tokenService.getAll().subscribe(
      (response) => {
        const firstToken = response[0];
        // console.log(firstToken);
        if (firstToken) {
          this.openaiInstance = new OpenAI({
            apiKey: firstToken.apiToken,
            dangerouslyAllowBrowser: true,
          });
        } else {
          console.log('No se encontraron tokens en la respuesta.');
        }
      },
      (error) => {
        console.log('Error al cargar el apikey', error);
      }
    );
  }

  async sendMessage() {
    if (this.userMessage.trim() === '') {
      return; // Evitar enviar mensajes vacíos
    }

    const userMessage = { role: 'user', content: this.userMessage.trim(), timestamp: Date.now() };
    this.chatHistory.push(userMessage);

    const prompt: ChatCompletionRequestMessage[] = [
      { role: "system", content: "😊 ¡Bienvenido a Austins Repostería! Soy tu asistente virtual de confianza. Estoy aquí para ayudarte con tus pedidos y consultas. 🍰" },
      { role: "system", content: "Austins Repostería es una pastelería artesanal dedicada a deleitar los paladares con exquisitos postres y pasteles. Nuestra pasión por la repostería se refleja en cada creación, desde su concepción hasta su presentación en tu mesa. 🎂" },
      { role: "system", content: "📍 La dirección de Austins Repostería es Avenida Profr. Toribio Reyes 5, Huejutla, Hidalgo, México." },
      { role: "system", content: "⏰ Horario de atención: Abierto de lunes a domingo de 8 am a 8:30 pm." },
      { role: "system", content: "☎️ Teléfono: 01 789 896 4530." },
      { role: "system", content: "👨‍🍳 dueño: Graham Austin." },
      { role: "system", content: "✉️ Correo electrónico: info@austins.com.mx." },
      { role: "system", content: "Para hacer un pedido en nuestro sitio web, sigue estos pasos: \n1. Visita nuestro sitio web en austins.vercel.app. \n2. Explora nuestro menú y selecciona los productos que deseas agregar al carrito. \n3. Ve al carrito y revisa tu selección. \n4. Procede al pago y sigue las instrucciones para completar tu pedido. 🛒" },
      { role: "user", content: this.userMessage }
    ];

    try {
      const response = await this.openaiInstance?.chat.completions.create({
        messages: prompt,
        model: "gpt-3.5-turbo",
      });

      if (response && response.choices && response.choices.length > 0) {
        const assistantResponse = response.choices[0].message?.content;
        if (assistantResponse) {
          this.chatHistory.push({
            role: 'assistant',
            content: assistantResponse,
            timestamp: Date.now()
          });
        }
      } else {
        console.error('Unexpected or undefined OpenAI response:', response);
      }
      this.retryCount = 0; // Reset retry count after a successful request
    } catch (error) {
      if (this.isRateLimitError(error)) {
        console.warn('Rate limit exceeded. Retrying after delay...');
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          // Espera antes de reenviar la solicitud
          setTimeout(() => this.sendMessage(), 60000); // Espera 60 segundos antes de intentar nuevamente
        } else {
          console.error('Max retries reached. Please try again later.');
        }
      } else {
        console.error('Error sending message to OpenAI:', error);
      }
    }

    this.userMessage = ''; // Limpia el mensaje del usuario después de enviar
  }

  isRateLimitError(error: any): boolean {
    return error.response && error.response.status === 429;
  }

  @Output() chatOpened = new EventEmitter<boolean>();
  chatOpen = false;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    this.floatingButtonState = this.chatOpen ? 'attention' : 'normal';

    if (this.chatOpen) {
      setTimeout(() => {
        this.floatingButtonState = 'normal';
      }, 3000);
    }
  }

  getMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
