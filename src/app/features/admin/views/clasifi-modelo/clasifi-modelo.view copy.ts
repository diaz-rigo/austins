// import { Component, OnInit } from '@angular/core';
// import { CustomerClusterService } from '../../commons/services/customer-cluster.service';

// @Component({
//   selector: 'app-clasifi-modelo',
//   templateUrl: './clasifi-modelo.view.html',
//   styleUrls: ['./clasifi-modelo.view.scss']
// })
// export class ClasifiModeloView implements OnInit {

//   clusteredCustomers: any[] = [];
//   // colors: string[] = ['#FF733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];  // Colores para los clusters
//   colors: string[] = [
//     '#FFB3BA', // Pastel pink
//     '#FFDFBA', // Pastel orange
//     '#FFFFBA', // Pastel yellow
//     '#BAFFC9', // Pastel green
//     '#BAE1FF'  // Pastel blue
//   ];

//   constructor(private clusterService: CustomerClusterService) {}

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   loadOrders(): void {
//     this.clusterService.getAllOrders().subscribe(
//       (data) => {
//         console.log('Orders fetched:', data);

//         // Procesar los datos para obtener solo los campos necesarios para clustering
//         const processedData = data.map((order: { total_orders: any; total_amount_spent: any; }) => ({
//           total_orders: order.total_orders,
//           total_amount_spent: order.total_amount_spent
//         }));

//         // Llamar a getClusters() con los datos procesados
//         this.clusterService.getClusters(processedData).subscribe(
//           (clusterData) => {
//             console.log('Clusters data:', clusterData);
//             this.clusteredCustomers = data.map((order: any, index: number) => ({
//               ...order,
//               cluster: clusterData[index].cluster  // Asignar el cluster a cada cliente
//             }));
//           },
//           (error) => {
//             console.error('Error fetching clusters:', error);
//           }
//         );
//       },
//       (error) => {
//         console.error('Error fetching orders:', error);
//       }
//     );
//   }

//   getClusterColor(cluster: number): string {
//     // Obtener el color para el cluster
//     return this.colors[cluster % this.colors.length];
//   }

//   getInitial(name: string): string {
//     // Obtener la inicial del nombre del cliente
//     return name.charAt(0).toUpperCase();
//   }
// }
