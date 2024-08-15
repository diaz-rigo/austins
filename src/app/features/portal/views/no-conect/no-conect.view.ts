import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-conect',
  templateUrl: './no-conect.view.html',
  styleUrl: './no-conect.view.scss'
})
export class NoConectView {

  constructor(   private router: Router,) { }

  ngOnInit(): void {
  }

  // Método para manejar el clic en el botón de contacto
  contactarPropietario() {
    // Puedes agregar lógica adicional aquí, por ejemplo, redirigir a una página de contacto
    console.log('Contactando al propietario...');
  }

  redirectTo(route: string): void {
    this.router.navigate(['/portal', route]); // Utiliza la navegación de Angular
  }
}
