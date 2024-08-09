// import { Component, ElementRef, ViewChild } from '@angular/core';
// import {
//   trigger,
//   state,
//   style,
//   animate,
//   transition,
//   // ...
// } from '@angular/animations';
// interface FaqItem {
//   question: string;
//   answer: string;
//   expanded: boolean;
// }

// @Component({
//   selector: 'app-preguntas-freq',
//   templateUrl: './preguntas-freq.view.html',
//   styleUrls: ['./preguntas-freq.view.scss'],
//   animations: [
//     trigger('dialogFadeInOut', [
//       state('void',
//       style({ transform: 'scale(0)', opacity: 0 }
//       )
//       ),
//       transition(':enter', [
//         animate(
//           '1000ms ease-in',
//           style({
//             transform: 'scale(1)',
//             opacity: 1,
//             scroll :-10,
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
//   ],
// })
// export class PreguntasFreqView {
// // ...

// faqList: FaqItem[] = [
//   {
//     question: '¿Cómo realizar un pedido?',
//     answer: 'Puedes realizar un pedido a través de nuestro sitio web seleccionando los productos deseados y siguiendo el proceso de compra.',
//     expanded: true
//   },
//   {
//     question: '¿Cuáles son los métodos de pago aceptados?',
//     answer: 'Aceptamos pagos con tarjeta de crédito, débito y otras opciones de pago en línea.',
//     expanded: true
//   },
//   {
//     question: '¿Cómo rastrear mi pedido?',
//     answer: 'Puedes rastrear tu pedido iniciando sesión en tu cuenta y yendo a la sección de historial de pedidos.',
//     expanded: true
//   },
//   {
//     question: '¿Cuánto tiempo tarda en llegar mi pedido?',
//     answer: 'El tiempo de entrega depende de tu ubicación y el tipo de envío seleccionado. Puedes consultar la estimación de entrega durante el proceso de compra.',
//     expanded: true
//   },
//   {
//     question: '¿Puedo cancelar mi pedido después de realizar la compra?',
//     answer: 'Lamentablemente, no podemos cancelar pedidos una vez que han sido confirmados. Te recomendamos revisar cuidadosamente tu pedido antes de confirmarlo.',
//     expanded: true
//   },
//   // Agrega más preguntas y respuestas según sea necesario
// ];

// // ...


//   // Corrige la importación de ViewChild
//   @ViewChild('faqListContainer') faqListContainer!: ElementRef;

//   // // Función para expandir o contraer una pregunta frecuente
//   // toggleFaq(faqItem: FaqItem): void {
//   //   faqItem.expanded = !faqItem.expanded;
//   //   this.animateScroll();
//   // }
// // ...
//    // Función para expandir o contraer una pregunta frecuente
//    toggleFaq(faqItem: FaqItem): void {
//     if (faqItem.expanded) {
//       this.animateScroll();
//       setTimeout(() => {
//         faqItem.expanded = !faqItem.expanded;
//       }, 1000); // Después de 3 segundos, oculta la respuesta con fade-out
//     } else {
//       faqItem.expanded = !faqItem.expanded;
//       this.animateScroll();
//     }
//   }
// // Función para animar el desplazamiento al expandir o contraer una pregunta
// // ...


//   // Función para animar el desplazamiento al expandir o contraer una pregunta
//   animateScroll(): void {
//     if (this.faqListContainer.nativeElement) {
//       this.faqListContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
//     }
//   }
// // ...


// }
