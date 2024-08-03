// import { Component, OnInit } from '@angular/core';
// import { ReportService } from '../../commons/services/report.service';

// @Component({
//   selector: 'app-incio-ad',
//   templateUrl: './incio-ad.view.html',
//   styleUrls: ['./incio-ad.view.scss']
// })
// export class InicioAdView implements OnInit {
//   sales: number = 25000;
//   orders: number = 150;
//   users: number = 300;
//   comments: number = 75;
//   inventory: number = 500;
//   coupons: number = 20;
//   ordersList: any[] = [
//     { id: 1, customer: 'Juan Perez', date: '2024-08-01', status: 'Pendiente' },
//     { id: 2, customer: 'Maria Lopez', date: '2024-08-02', status: 'En Proceso' },
//     // Más datos mock
//   ];

//   // Gráfica de datos
//   data: any;
//   options: any;

//   estadisticas: any = {};
//   estadisticasPedidos: any = {};
//   estadisticasUsuarios: any = {};
//   estadisticasProductos: any = {};

//   constructor(private reportService: ReportService) { }

//   ngOnInit() {
//     this.reportService.getEstadisticas().subscribe(data => {
//       this.estadisticas = data;
//       this.sales = this.estadisticas.totalVentas || 0;
//       this.orders = this.estadisticas.totalPedidos || 0;
//     });

//     this.reportService.getEstadisticasPedidos().subscribe(data => {
//       this.estadisticasPedidos = data;
//     });

//     this.reportService.getEstadisticasUsuarios().subscribe(data => {
//       this.estadisticasUsuarios = data;
//       this.users = this.estadisticasUsuarios.usuariosTotales.totalUsuarios || 0;
//     });

//     this.reportService.getEstadisticasProductos().subscribe(data => {
//       this.estadisticasProductos = data;
//       this.inventory = this.estadisticasProductos.productosTotales.totalProductos || 0;
//     });

//     // Datos de la gráfica
//     this.data = {
//       labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
//       datasets: [
//         {
//           label: 'Ventas',
//           data: [65, 59, 80, 81, 56, 55, 40],
//           fill: false,
//           borderColor: '#42A5F5',
//           tension: 0.4
//         },
//         {
//           label: 'Nuevos Usuarios',
//           data: [28, 48, 40, 19, 86, 27, 90],
//           fill: false,
//           borderColor: '#FFA726',
//           tension: 0.4
//         }
//       ]
//     };

//     this.options = {
//       plugins: {
//         legend: {
//           display: true
//         }
//       },
//       scales: {
//         x: {
//           display: true,
//           title: {
//             display: true,
//             text: 'Meses'
//           }
//         },
//         y: {
//           display: true,
//           title: {
//             display: true,
//             text: 'Valores'
//           }
//         }
//       }
//     };
//   }
// }
