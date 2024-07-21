// import { Component, EventEmitter, Output } from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';
// import { TokenService } from 'src/app/shared/services/token.service';
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Define el tipo de mensajes de chat esperados por la API de Gemini
// interface ChatCompletionRequestMessage {
//   role: 'system' | 'user' | 'model';
//   content: string;
// }

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.scss', './floating.scss'],
//   animations: [
//     trigger('dialogFadeInOut', [
//       state('void', style({ transform: 'scale(0)', opacity: 0 })),
//       transition(':enter', [
//         animate(
//           '1000ms ease-in',
//           style({
//             transform: 'scale(1)',
//             opacity: 1,
//             scroll: -10,
//           })
//         ),
//       ]),
//       transition(':leave', [
//         animate(
//           '1000ms ease-out',
//           style({ transform: 'scale(0.5)', opacity: 0 })
//         ),
//       ]),
//     ]),
//     trigger('floatingButtonAttention', [
//       state('normal', style({})),
//       state(
//         'attention',
//         style({
//           animation: '2s infinite alternate attention',
//         })
//       ),
//     ]),
//   ],
// })
// export class ChatComponent {
//   userMessage: string = '';
//   chatHistory: any[] = [];
//   floatingButtonState = 'normal';
//   geminiInstance: any; // Placeholder for the Gemini instance
//   retryCount: number = 0;
//   maxRetries: number = 5;

//   message!: string;
//   constructor(private tokenService: TokenService) {
//     this.tokenService.getAll().subscribe(
//       async (response) => {
//         const firstToken = response[0];
//         if (firstToken) {
//           this.geminiInstance = new GoogleGenerativeAI(firstToken.apiToken);
//         } else {
//           console.log('No se encontraron tokens en la respuesta.');
//         }
//       },
//       (error) => {
//         console.log('Error al cargar el apikey', error);
//       }
//     );
//   }
//   async sendMessage() {
//     if (!this.userMessage.trim()) return;

//     // Agregar mensaje del usuario a la historia del chat
//     this.chatHistory.push({ role: 'user', content: this.userMessage, timestamp: Date.now() });

//     try {
//         const model = this.geminiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });

//         // Historial inicial con contexto relevante
//         const initialHistory = [
//             {
//                 role: "user",
//                 parts: [{ text: this.userMessage }],
//             },
//             {
//                 role: "model",
//                 parts: [{
//                     text: `😊 ¡Bienvenido a Austins Repostería! Soy tu asistente virtual de confianza. Estoy aquí para ayudarte con tus pedidos y consultas. 🍰\n\nAustins Repostería es una pastelería artesanal dedicada a deleitar los paladares con exquisitos postres y pasteles. Nuestra pasión por la repostería se refleja en cada creación, desde su concepción hasta su presentación en tu mesa. 🎂\n\n📍 La dirección de Austins Repostería es Avenida Profr. Toribio Reyes 5, Huejutla, Hidalgo, México.\n\n⏰ Horario de atención: Abierto de lunes a domingo de 8 am a 8:30 pm.\n\n☎️ Teléfono: 01 789 896 4530.\n\n👨‍🍳 Dueño: Graham Austin.\n\n✉️ Correo electrónico: info@austins.com.mx.\n\nPara hacer un pedido en nuestro sitio web, sigue estos pasos:\n1. Visita nuestro sitio web en austins.vercel.app.\n2. Explora nuestro menú y selecciona los productos que deseas agregar al carrito.\n3. Ve al carrito y revisa tu selección.\n4. Procede al pago y sigue las instrucciones para completar tu pedido. 🛒`
//                 }],
//             },
//         ];

//         const chat = model.startChat({
//             history: initialHistory,
//             generationConfig: {
//                 maxOutputTokens: 100,
//             },
//         });

//         const result = await chat.sendMessage(this.userMessage);
//         const response = await result.response;
//         const text = await response.text(); // Asegúrate de esperar la conversión a texto

//         console.log(text);

//         this.userMessage = '';
//         this.chatHistory.push({ role: 'model', content: text, timestamp: Date.now() });
//     } catch (error) {
//         console.error('Error al generar contenido:', error);
//         this.chatHistory.push({ role: 'model', content: 'Lo siento, hubo un error al generar la respuesta.', timestamp: Date.now() });
//     }
//   }
// // async sendMessage() {
// //     if (!this.userMessage.trim()) return;

// //     // Agregar mensaje del usuario a la historia del chat
// //     this.chatHistory.push({ role: 'user', content: this.userMessage, timestamp: Date.now() });

// //     try {
// //         const model = this.geminiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });

// //         // Historial inicial con contexto de la pastelería de Austin
// //         const initialHistory = [
// //             {
// //                 role: "user",
// //                 parts: [{ text: this.userMessage }],
// //             },
// //             {
// //                 role: "model",
// //                 parts: [{
// //                     text: `😊 ¡Bienvenido a Austins Repostería! Soy tu asistente virtual de confianza. Estoy aquí para ayudarte con tus pedidos y consultas. 🍰\n\nAustins Repostería es una pastelería artesanal dedicada a deleitar los paladares con exquisitos postres y pasteles. Nuestra pasión por la repostería se refleja en cada creación, desde su concepción hasta su presentación en tu mesa. 🎂\n\n📍 La dirección de Austins Repostería es Avenida Profr. Toribio Reyes 5, Huejutla, Hidalgo, México.\n\n⏰ Horario de atención: Abierto de lunes a domingo de 8 am a 8:30 pm.\n\n☎️ Teléfono: 01 789 896 4530.\n\n👨‍🍳 Dueño: Graham Austin.\n\n✉️ Correo electrónico: info@austins.com.mx.\n\nPara hacer un pedido en nuestro sitio web, sigue estos pasos:\n1. Visita nuestro sitio web en austins.vercel.app.\n2. Explora nuestro menú y selecciona los productos que deseas agregar al carrito.\n3. Ve al carrito y revisa tu selección.\n4. Procede al pago y sigue las instrucciones para completar tu pedido. 🛒`
// //                 }],
// //             },
// //         ];

// //         const chat = model.startChat({
// //             history: initialHistory,
// //             generationConfig: {
// //                 maxOutputTokens: 100,
// //             },
// //         });

// //         const result = await chat.sendMessage(this.userMessage);
// //         const response = await result.response;
// //         const text = await response.text(); // Asegúrate de esperar la conversión a texto

// //         console.log(text);

// //         this.userMessage = '';
// //         this.chatHistory.push({ role: 'model', content: text, timestamp: Date.now() });
// //     } catch (error) {
// //         console.error('Error al generar contenido:', error);
// //         this.chatHistory.push({ role: 'model', content: 'Lo siento, hubo un error al generar la respuesta.', timestamp: Date.now() });
// //     }
// // }




//   isRateLimitError(error: any): boolean {
//     return error.response && error.response.status === 429;
//   }

//   @Output() chatOpened = new EventEmitter<boolean>();
//   chatOpen = false;

//   toggleChat() {
//     this.chatOpen = !this.chatOpen;
//     this.floatingButtonState = this.chatOpen ? 'attention' : 'normal';

//     if (this.chatOpen) {
//       setTimeout(() => {
//         this.floatingButtonState = 'normal';
//       }, 3000);
//     }
//   }

//   getMessageTime(timestamp: number): string {
//     const date = new Date(timestamp);
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
//   }
// }
