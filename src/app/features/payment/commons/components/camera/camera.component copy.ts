// import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

// @Component({
//   selector: 'app-camera',
//   templateUrl: './camera.component.html',
//   styleUrls: ['./camera.component.scss']
// })
// export class CameraComponent implements AfterViewInit {
//   @ViewChild('videoElement', { static: false }) videoElement: ElementRef | undefined;
//   stream: MediaStream | undefined;
//   isCameraOpen: boolean = false;  // Variable para controlar la visibilidad de la cámara

//   constructor(private elementRef: ElementRef) {}

//   ngAfterViewInit() {
//     if (!this.videoElement) {
//       console.error('Video element no está disponible en ngAfterViewInit');
//     }
//   }

//   startCamera() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
//         this.stream = stream;
//         if (this.videoElement && this.videoElement.nativeElement) {
//           this.videoElement.nativeElement.srcObject = stream;
//           this.videoElement.nativeElement.play();
//         }
//       }).catch(error => console.error('Error al abrir la cámara:', error));
//     }
//     this.isCameraOpen = true;
//   }

//   capturePhoto() {
//     if (this.videoElement && this.videoElement.nativeElement) {
//       const video = this.videoElement.nativeElement;

//       // Asegurarse de que el video se esté reproduciendo
//       if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         const canvas = document.createElement('canvas');
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           // Dibujar la imagen del video en el lienzo
//           ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//           // Obtener los datos de la imagen en formato base64
//           const imageData = canvas.toDataURL('image/png');
//           console.log('Foto capturada:', imageData);

//           // Aquí podrías hacer algo con la imagen, como enviarla al servidor
//         } else {
//           console.error('Error al obtener el contexto del lienzo.');
//         }
//       } else {
//         console.error('El video no está listo para capturar una foto.');
//       }
//     } else {
//       console.warn('VideoElement no está disponible.');
//     }
//   }

//   stopCamera() {
//     if (this.stream) {
//       const tracks = this.stream.getTracks();
//       tracks.forEach((track: MediaStreamTrack) => track.stop());
//       this.isCameraOpen = false;
//       if (this.videoElement && this.videoElement.nativeElement) {
//         this.videoElement.nativeElement.srcObject = null; // Detener el stream de video
//       }
//     } else {
//       console.warn('Stream no está disponible.');
//     }
//   }
// }
