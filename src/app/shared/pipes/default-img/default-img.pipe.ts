// default-img.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'defaultImg'
})
export class DefaultImgPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) {
      return 'assets/img/default.jpg'; // Devuelve la imagen predeterminada si value es undefined
    } else {
      return `${environment.api}/${value}`; // Construye la URL completa si value tiene un valor
    }
  }

}
