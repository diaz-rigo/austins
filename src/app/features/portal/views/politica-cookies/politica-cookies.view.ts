import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-politica-cookies',
  templateUrl: './politica-cookies.view.html',
  styleUrls: ['./politica-cookies.view.scss'],
  animations: [
    trigger('dialogFadeInOut', [
      state('void',
      style({ transform: 'scale(0)', opacity: 0 }
      )
      ),
      transition(':enter', [
        animate(
          '300ms ease-in'
          // style({
          //   transform: 'scale(1)',
          //   opacity: 1,
          //   // scroll :-10,
          // })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out'
          // style({ transform: 'scale(0.5)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class PoliticaCookiesView {
  showSeccionMas = false; // Inicialmente oculta
  redirectTo(url: string): void {
    window.location.href = url;
  }

  informacionUtil() {
    // Puedes agregar aquí la lógica para manejar el clic en "¿Esta información fue útil?"
    console.log('Información útil');
    // Puedes hacer más aquí, por ejemplo, enviar datos a un servidor.
  }

  comentarios() {
    // Puedes agregar aquí la lógica para manejar el clic en "Déjanos tus comentarios"
    console.log('Déjanos tus comentarios');
    // Puedes hacer más aquí, por ejemplo, abrir un formulario de comentarios.
  }
}