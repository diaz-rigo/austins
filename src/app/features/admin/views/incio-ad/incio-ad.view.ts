import { Component } from '@angular/core';

@Component({
  selector: 'app-incio-ad',
  templateUrl: './incio-ad.view.html',
  styleUrls: ['./incio-ad.view.scss']
})
export class InicioAdView {
  value = [
    { label: 'Ventas', value: 75, color1: '#34d399', color2: '#2ddbb0', icon: 'fas fa-chart-line' },
    { label: 'Pedidos', value: 60, color1: '#fbbf24', color2: '#fcd34d', icon: 'fas fa-shopping-cart' },
    { label: 'Usuarios', value: 90, color1: '#60a5fa', color2: '#3b82f6', icon: 'fas fa-users' },
    { label: 'Comentarios', value: 40, color1: '#c084fc', color2: '#a855f7', icon: 'fas fa-comments' }
  ];
}
