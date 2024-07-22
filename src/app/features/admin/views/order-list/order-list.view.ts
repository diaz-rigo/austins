import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { OrderService } from 'src/app/features/payment/commons/services/order.service';

// Define una interfaz para representar la estructura de un pedido
interface Pedido {
  _id: string;
  codigoPedido: string;
  usuario: {
    _id: string;
    email: string;
    password: string;
    rol: string;
    name: string;
    maternalLastname: string;
    paternalLastname: string;
    phone: string;
    status: string;
    loginAttempts: number;
  };
  detallePedido: {
    _id: string;
    cantidad: number;
    dia: string;
    hora: string;
    modo: string;
    modoPersonalizado: string;
    sabor: string;
    saborPersonalizado: string;
    precioTotal: number;
  }[];
  estadoPedido: string;
  createdAt: string;
}
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.view.html',
  styleUrl: './order-list.view.scss',
})
export class OrderListView {


  pedidos: Pedido[] = []; // Definición de la propiedad pedidos como un array de objetos Pedido
  consultaPedidosSubscription: Subscription | undefined;

  constructor(private ordersService: OrderService) { }

  ngOnInit(): void {
    this.consultarPedidosPeriodicamente();
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción cuando el componente se destruye para evitar fugas de memoria
    if (this.consultaPedidosSubscription) {
      this.consultaPedidosSubscription.unsubscribe();
    }
  }

  consultarPedidosPeriodicamente(): void {
    // Crear un intervalo que se ejecute cada 5 segundos (puedes ajustar este valor según tus necesidades)
    this.consultaPedidosSubscription = interval(5000).pipe(
      // Utilizar switchMap para cancelar la solicitud anterior si se emite un nuevo intervalo
      switchMap(() => this.ordersService.getAllOrders())
    ).subscribe(
      (response: any) => {
        console.log(response)
        this.pedidos = response.pedidos; // Actualizar los pedidos con la respuesta del servicio
      },
      (error) => {
        console.error('Error al obtener los pedidos:', error);
      }
    );
  }
}
