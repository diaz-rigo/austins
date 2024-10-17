// // import { Component, ElementRef, ViewChild } from '@angular/core';

// // @Component({
// //   selector: 'app-camera',
// //   templateUrl: './camera.component.html',
// //   styleUrls: ['./camera.component.scss']
// // })
// // export class CameraComponent {
// //   @ViewChild('videoElement', { static: false }) videoElement: ElementRef | undefined;
// //   stream: MediaStream | undefined;
// //   isCameraOpen: boolean = false;  // Nueva variable para controlar la visibilidad de la cámara

// //   constructor(private elementRef: ElementRef) {
// //     if(this.isCameraOpen=true){
// //       this.startCamera()
// //     }
// //   }
// //   startCamera() {
// //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// //       navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
// //         this.stream = stream;
// //         if (this.videoElement && this.videoElement.nativeElement) {
// //           this.videoElement.nativeElement.srcObject = stream;
// //           this.videoElement.nativeElement.play();
// //         }
// //         this.isCameraOpen = true;  // Abrir la cámara y hacer visible el video
// //       }).catch(error => console.error('Error al abrir la cámara:', error));
// //     }
// //   }

// //   capturePhoto() {
// //     if (this.videoElement && this.videoElement.nativeElement) {
// //       const canvas = document.createElement('canvas');
// //       canvas.width = this.videoElement.nativeElement.videoWidth;
// //       canvas.height = this.videoElement.nativeElement.videoHeight;
// //       const ctx = canvas.getContext('2d');
// //       if (ctx) {
// //         ctx.drawImage(this.videoElement.nativeElement, 0, 0);
// //         const imageData = canvas.toDataURL('image/png');
// //         console.log('Foto capturada:', imageData);
// //       }
// //     } else {
// //       console.warn('VideoElement no está disponible.');
// //     }
// //   }

// //   stopCamera() {
// //     if (this.stream) {
// //       const tracks = this.stream.getTracks();
// //       tracks.forEach((track: MediaStreamTrack) => track.stop());
// //       this.isCameraOpen = false;  // Cerrar la cámara y ocultar el video
// //     } else {
// //       console.warn('Stream no está disponible.');
// //     }
// //   }
// // }


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

//   constructor(private elementRef: ElementRef) {


//   }
//   ngAfterViewInit() {
//     // Verificamos que el elemento de video esté inicializado correctamente.
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
//     this.isCameraOpen = true;  // Abrir la cámara y hacer visible el video
//   }

//   capturePhoto() {
//     if (this.videoElement && this.videoElement.nativeElement) {
//       const canvas = document.createElement('canvas');
//       canvas.width = this.videoElement.nativeElement.videoWidth;
//       canvas.height = this.videoElement.nativeElement.videoHeight;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.drawImage(this.videoElement.nativeElement, 0, 0);
//         const imageData = canvas.toDataURL('image/png');
//         console.log('Foto capturada:', imageData);
//       }
//     } else {
//       console.warn('VideoElement no está disponible.');
//     }
//   }

//   stopCamera() {
//     if (this.stream) {
//       const tracks = this.stream.getTracks();
//       tracks.forEach((track: MediaStreamTrack) => track.stop());
//       this.isCameraOpen = false;  // Cerrar la cámara y ocultar el video
//     } else {
//       console.warn('Stream no está disponible.');
//     }
//   }
// }
