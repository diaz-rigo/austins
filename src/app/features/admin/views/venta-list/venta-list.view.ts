import { Component, ViewEncapsulation } from '@angular/core';
import { OrderService } from 'src/app/features/payment/commons/services/order.service';

interface Venta {
  _id: string;
  user: string;
  products: any[];
  totalAmount: number;
  deliveryType: string;
  deliveryDate: string;
  instrucion: string;
  status: string;
  createdAt: string;
  productsInfo: any[];
  userInfo: any[];
}

@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.view.html',
  styleUrl: './venta-list.view.scss',
  encapsulation: ViewEncapsulation.None
})
export class VentaListView {
  ventas: Venta[] = [];

  constructor(private ordersService: OrderService) { }

  ngOnInit(): void {
    this.consultarPedidosPeriodicamente();
  }

  consultarPedidosPeriodicamente(): void {
    this.ordersService.getAllVentas().subscribe((orders: any) => {
      this.ventas = orders.ventas;
      console.log( this.ventas)
    });
  }
}
