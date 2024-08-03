import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReportService } from '../../commons/services/report.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-incio-ad',
  templateUrl: './incio-ad.view.html',
  styleUrls: ['./incio-ad.view.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class InicioAdView implements OnInit, OnDestroy {
  sales: number = 0;
  ventas: number = 0;
  orders: number = 0;
  users: number = 0;
  users_ADMIN: number = 0;
  users_CLIENT: number = 0;
  comments: number = 0;
  inventory: number = 0;
  coupons: number = 0;
  pendingSales: number = 0;
  pendingOrders: number = 0;
  ventasExpirados: number = 0;
  completedSales: number = 0;
  completedOrders: number = 0;
  totalOrderAmount: number = 0;
  ordersList: any[] = [
    { id: 1, customer: 'Juan Perez', date: '2024-08-01', status: 'Pendiente' },
    { id: 2, customer: 'Maria Lopez', date: '2024-08-02', status: 'En Proceso' },
    // Más datos mock
  ];

  // Gráfica de datos
  data: any;
  options: any;
  updateSubscription!: Subscription;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadStatistics();
    this.loadChartData();
    this.updateSubscription = interval(5000).subscribe(() => this.loadStatistics()); // Actualiza cada 5 segundos
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadStatistics() {
    this.reportService.getEstadisticas().subscribe(data => {
      this.sales = data.totalVentas || 0;
      this.ventas = data.totalPedidos || 0;
      this.pendingSales = data.ventasPendientes || 0;
      this.completedSales = data.ventasCompletadas || 0;
      this.ventasExpirados = data.ventasExpirados || 0;
      console.log("ventas-----", data);
    });

    this.reportService.getEstadisticasPedidos().subscribe(data => {
      this.orders = data.totalPedidos || 0;
      this.pendingOrders = data.pedidosPendientes || 0;
      this.completedOrders = data.pedidosCompletados || 0;
      this.totalOrderAmount = data.totalAmount || 0;
      console.log("pedidos-----", data);
    });

    this.reportService.getEstadisticasUsuarios().subscribe(data => {
      this.users = data.usuariosTotales.totalUsuarios || 0;
      const rolesCount = data.rolesCount || [];
      this.users_ADMIN = rolesCount.find((role: { _id: string; }) => role._id === 'ADMIN')?.count || 0;
      this.users_CLIENT = rolesCount.find((role: { _id: string; }) => role._id === 'CLIENT')?.count || 0;
      console.log("usuarios-----", data);
    });

    this.reportService.getEstadisticasProductos().subscribe(data => {
      this.inventory = data.productosTotales.totalProductos || 0;
      console.log("productos-----", data);
    });
  }

  loadChartData() {
    // Datos de la gráfica
    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Ventas',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Nuevos Usuarios',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Meses'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Valores'
          }
        }
      }
    };
  }
}
