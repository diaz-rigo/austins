import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/features/payment/commons/services/feedback.service';
import { FeedbackSummary } from 'src/app/shared/models/feedback.model';
import { TooltipItem, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'app-graf-pastel',
  templateUrl: './graf-pastel.component.html',
  styleUrls: ['./graf-pastel.component.scss']
})
export class GrafPastelComponent implements OnInit {
  // Datos para los gráficos
  npsDistributionChartData: number[] = [0, 0, 0]; // NPS (bajo, medio, alto)
  easeOfUseChartData: number[] = [0, 0, 0]; // Facilidad de uso (bajo, medio, alto)
  satisfactionChartData: number[] = [0, 0, 0]; // Satisfacción (bajo, medio, alto)

  // Etiquetas para los gráficos
  npsDistributionChartLabels: string[] = ['Bajo (0-6)', 'Medio (7-8)', 'Alto (9-10)'];
  easeOfUseChartLabels: string[] = ['Bajo (1)', 'Medio (2-3)', 'Alto (4-5)'];
  satisfactionChartLabels: string[] = ['Bajo (1)', 'Medio (2-3)', 'Alto (4-5)'];

  // Opciones para los gráficos
  npsDistributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const datasetIndex = tooltipItem.datasetIndex || 0; // Índice del conjunto de datos
            const index = tooltipItem.dataIndex; // Índice del dato actual
            const value = tooltipItem.chart.data.datasets?.[datasetIndex]?.data?.[index]; // Valor del dato
  
            return `Cantidad: ${value}`;
          }
        }
      }
    }
  };
  

  easeOfUseChartOptions = this.npsDistributionChartOptions;
  satisfactionChartOptions = this.npsDistributionChartOptions;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.feedbackService.getFeedback().subscribe(
      (data: FeedbackSummary) => {
        this.processFeedbackData(data);
      },
      (error) => console.error('Error al obtener el feedback:', error)
    );
  }

  // Función para procesar los datos recibidos y asignar los valores para los gráficos
  processFeedbackData(feedbackSummary: FeedbackSummary): void {
    this.npsDistributionChartData = [0, 0, 0];
    this.easeOfUseChartData = [0, 0, 0];
    this.satisfactionChartData = [0, 0, 0];

    feedbackSummary.feedbacks.forEach(feedback => {
      if (feedback.npsScore <= 6) this.npsDistributionChartData[0]++;
      else if (feedback.npsScore <= 8) this.npsDistributionChartData[1]++;
      else this.npsDistributionChartData[2]++;

      if (feedback.easeOfUse <= 1) this.easeOfUseChartData[0]++;
      else if (feedback.easeOfUse <= 3) this.easeOfUseChartData[1]++;
      else this.easeOfUseChartData[2]++;

      if (feedback.satisfaction <= 1) this.satisfactionChartData[0]++;
      else if (feedback.satisfaction <= 3) this.satisfactionChartData[1]++;
      else this.satisfactionChartData[2]++;
    });
  }
}
