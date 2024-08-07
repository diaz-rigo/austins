// clasifi-modelo.view.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerClusterService } from '../../commons/services/customer-cluster.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-clasifi-modelo',
  templateUrl: './clasifi-modelo.view.html',
  styleUrls: ['./clasifi-modelo.view.scss']
})
export class ClasifiModeloView implements OnInit {
  clusteredCustomers: any[] = [];
  colors: string[] = [
    '#FFB3BA', // Pastel pink
    '#FFDFBA', // Pastel orange
    '#FFFFBA', // Pastel yellow
    '#BAFFC9', // Pastel green
    '#BAE1FF'  // Pastel blue
  ];
  predictionForm!: FormGroup;
  clusterStats: { [key: string]: number } = {};  // Estadísticas de clusters
  municipioStats: { [key: string]: any } = {}; // Estadísticas por municipio
  municipioStatsTable: any[] = []; // Datos para la tabla de estadísticas por municipio
  municipioChartData: ChartData<'bar'> = { labels: [], datasets: [] }; // Datos para el gráfico de estadísticas por municipio
  municipioChartOptions: ChartOptions<'bar'> = {}; // Opciones del gráfico

  constructor(private clusterService: CustomerClusterService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadOrders();
    this.predictionForm = this.fb.group({
      total_orders: [0, [Validators.required, Validators.min(1)]],
      total_amount_spent: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  loadOrders(): void {
    this.clusterService.getAllOrders().subscribe(
      (data) => {
        console.log('Orders fetched:', data);

        const processedData = data.map((order: { total_orders: any; total_amount_spent: any; }) => ({
          total_orders: order.total_orders,
          total_amount_spent: order.total_amount_spent
        }));

        this.clusterService.getClusters(processedData).subscribe(
          (clusterData) => {
            console.log('Clusters data:', clusterData);
            this.clusteredCustomers = data.map((order: any, index: number) => ({
              ...order,
              cluster: clusterData[index].cluster
            }));

            // Calcular estadísticas de clusters y municipios
            this.calculateClusterStats();
            this.calculateMunicipioStats();
            this.prepareChartData();
          },
          (error) => {
            console.error('Error fetching clusters:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  calculateClusterStats(): void {
    this.clusterStats = {
      'Clientes de Alto Valor': 0,
      'Clientes Frecuentes de Bajo Gasto': 0,
      'Clientes Esporádicos de Alto Gasto': 0
    };

    this.clusteredCustomers.forEach(customer => {
      if (customer.cluster === 0) {
        this.clusterStats['Clientes de Alto Valor']++;
      } else if (customer.cluster === 1) {
        this.clusterStats['Clientes Frecuentes de Bajo Gasto']++;
      } else if (customer.cluster === 2) {
        this.clusterStats['Clientes Esporádicos de Alto Gasto']++;
      }
    });

    console.log('Cluster Statistics:', this.clusterStats);
  }

  calculateMunicipioStats(): void {
    this.municipioStats = {};

    this.clusteredCustomers.forEach(customer => {
      if (!this.municipioStats[customer.municipio]) {
        this.municipioStats[customer.municipio] = {
          altoValor: 0,
          frecuentesBajoGasto: 0,
          esporadicosAltoGasto: 0
        };
      }

      if (customer.cluster === 0) {
        this.municipioStats[customer.municipio].altoValor++;
      } else if (customer.cluster === 1) {
        this.municipioStats[customer.municipio].frecuentesBajoGasto++;
      } else if (customer.cluster === 2) {
        this.municipioStats[customer.municipio].esporadicosAltoGasto++;
      }
    });

    this.municipioStatsTable = Object.keys(this.municipioStats).map(municipio => ({
      municipio: municipio,
      ...this.municipioStats[municipio]
    }));

    console.log('Municipio Statistics:', this.municipioStats);
  }

  prepareChartData(): void {
    const labels = Object.keys(this.municipioStats);
    const altoValorData = labels.map(label => this.municipioStats[label].altoValor);
    const frecuentesBajoGastoData = labels.map(label => this.municipioStats[label].frecuentesBajoGasto);
    const esporadicosAltoGastoData = labels.map(label => this.municipioStats[label].esporadicosAltoGasto);

    this.municipioChartData = {
      labels: labels,


      datasets: [
        {
          label: 'Clientes de Alto Valor',
          data: altoValorData,
          backgroundColor: '#FFB3BA',

        },
        {
          label: 'Clientes Frecuentes de Bajo Gasto',
          data: frecuentesBajoGastoData,
          backgroundColor: '#FFDFBA',

        },
        {
          label: 'Clientes Esporádicos de Alto Gasto',
          data: esporadicosAltoGastoData,
          backgroundColor: '#BAFFC9',

        }
      ]
    };

    this.municipioChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: '#eee',
          },
        },
      }
    };
  }

  onSubmit(): void {
    if (this.predictionForm.valid) {
      // Lógica para predecir el cluster basado en el formulario
      const formValue = this.predictionForm.value;
      this.clusterService.getClusters([formValue]).subscribe(
        (prediction) => {
          console.log('Prediction:', prediction);
          const clusterMessage = this.getClusterMessage(prediction[0].cluster);
          alert(clusterMessage);
          // Aquí puedes actualizar el estado de tu aplicación con la predicción
        },
        (error) => {
          console.error('Error predicting cluster:', error);
        }
      );
    }
  }

  getClusterMessage(cluster: number): string {
    const clusterMessages: { [key: number]: string } = {
      0: ' cliente Alto Valor',
      1: ' cliente Frecuentes de Bajo Gasto',
      2: ' cliente Esporádicos de Alto Gasto'
    };

    return clusterMessages[cluster] || 'Cluster desconocido';
  }


  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  getClusterColor(cluster: number): string {
    return this.colors[cluster % this.colors.length];
  }
}
