import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/features/payment/commons/services/feedback.service';
import { FeedbackSummary, Feedback } from 'src/app/shared/models/feedback.model';
import { ChartDataset, ChartType } from 'chart.js';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackSummary: FeedbackSummary | null = null;
  dateRange: Date[] = []; // Almacena las fechas seleccionadas
  filteredFeedbacks: Feedback[] = []; // Feedbacks filtrados

  // Labels and data for the bar chart
  averageScoresChartLabels = ['Puntaje NPS', 'Facilidad de Uso', 'Satisfacción'];
  averageScoresChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Puntuaciones Promedio' }
  ];
  averageScoresChartType: ChartType = 'bar';
  averageScoresChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
  filterFeedbacksByDate(): void {
    if (this.dateRange.length === 2) {
      const [startDate, endDate] = this.dateRange.map(date => {
        const adjustedDate = new Date(date);
        return new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate()).getTime();
      });

      // Filtra los feedbacks según las fechas
      this.filteredFeedbacks = this.feedbackSummary?.feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt).getTime(); // Asegúrate que `createdAt` es UTC
        return feedbackDate >= startDate && feedbackDate <= endDate;
      }) || [];

      console.log("Feedbacks filtrados:", this.filteredFeedbacks);

      // Actualiza los gráficos con los datos filtrados
      this.updateFeedbackRadarChart(this.filteredFeedbacks);
      this.updateFeedbackPieChart(this.filteredFeedbacks);
    } else {
      console.warn('Debe seleccionar un rango de fechas válido.');
    }
  }
  // feedbackPieChartData: any[];  // Declarar feedbackPieChartData en el componente si realmente es necesario.

  // Labels and data for the radar chart
  feedbackRadarChartLabels = ['Puntaje NPS', 'Facilidad de Uso', 'Satisfacción'];
  feedbackRadarChartData: ChartDataset<'radar'>[] = [];
  feedbackRadarChartType: ChartType = 'radar';
  feedbackPieChartData: ChartDataset<'pie'>[] = [];
  feedbackRadarChartOptions = {
    responsive: true,
    scale: { ticks: { beginAtZero: true } }
  };


  lowScoreFeedbacks: Feedback[] = [];
  bestExperiences: Feedback[] = [];
  worstExperiences: Feedback[] = [];
    // Configuración para gráficos de puntajes promedio y radar
    // averageScoresChartLabels = ['Puntaje NPS', 'Facilidad de Uso', 'Satisfacción'];
    // averageScoresChartData: ChartDataset<'bar'>[] = [{ data: [], label: 'Puntuaciones Promedio' }];
    // feedbackRadarChartLabels = ['Puntaje NPS', 'Facilidad de Uso', 'Satisfacción'];
    // feedbackRadarChartData: ChartDataset<'radar'>[] = [];

    // Nuevas variables para análisis adicional
     chartColors = ['#FF6384', '#36A2EB', '#FFCE56'];

    npsDistributionChartLabels = ['Negativos', 'Neutros', 'Promotores'];
    npsDistributionChartData: ChartDataset<'pie'>[] = [{ data: [], label: 'Distribución NPS' ,    backgroundColor: this.chartColors
    }];
    npsDistributionChartOptions = { responsive: true };
  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.feedbackService.getFeedback().subscribe(
      (data) => {
        this.feedbackSummary = data;
        this.updateAverageScoresChart(data);
        this.updateFeedbackRadarChart(data.feedbacks);
        this.calculateNPSDistribution(data.feedbacks);
        this.getBestAndWorstExperiences(data.feedbacks);
        this.getLowScoreFeedbacks(data.feedbacks);
      },
      (error) => console.error('Error al obtener el feedback:', error)
    );
  }

  updateAverageScoresChart(data: FeedbackSummary): void {
    this.averageScoresChartData = [
      {
        data: [
          data.averageScores.npsScore,
          data.averageScores.easeOfUse,
          data.averageScores.satisfaction,
        ],
        label: 'Puntuaciones Promedio',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores personalizados
      }
    ];
  }

  updateFeedbackRadarChart(feedbacks: Feedback[]): void {
    this.feedbackRadarChartData = feedbacks.map(feedback => ({
      data: [feedback.npsScore, feedback.easeOfUse, feedback.satisfaction],
      label: `Feedback de ${feedback.datosCliente.name}`
    }));
  }
  updateFeedbackPieChart(feedbacks: Feedback[]): void {
    const satisfied = feedbacks.filter(feedback => feedback.satisfaction === 1).length;   // 1 for "satisfied"
    const neutral = feedbacks.filter(feedback => feedback.satisfaction === 0).length;     // 0 for "neutral"
    const dissatisfied = feedbacks.filter(feedback => feedback.satisfaction === -1).length; // -1 for "dissatisfied"

    this.feedbackPieChartData = [
      {
        data: [satisfied, neutral, dissatisfied],
        label: 'Distribución de Satisfacción',
        backgroundColor: this.chartColors // Using the predefined colors
      }
    ];
  }

  calculateNPSDistribution(feedbacks: Feedback[]): void {
    let promoters = 0, passives = 0, detractors = 0;

    feedbacks.forEach(feedback => {
      if (feedback.npsScore >= 9) {
        promoters++;
      } else if (feedback.npsScore >= 7) {
        passives++;
      } else {
        detractors++;
      }
    });

    this.npsDistributionChartData = [
      {
        data: [detractors, passives, promoters],
        label: 'Distribución NPS',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores personalizados
      }
    ];
  }

  getBestAndWorstExperiences(feedbacks: Feedback[]): void {
    const sortedFeedbacks = [...feedbacks].sort((a, b) => b.satisfaction - a.satisfaction);
    this.bestExperiences = sortedFeedbacks.slice(0, 3);  // Top 3 mejores experiencias
    this.worstExperiences = sortedFeedbacks.slice(-3);  // Top 3 peores experiencias
  }

  getLowScoreFeedbacks(feedbacks: Feedback[]): void {
    this.lowScoreFeedbacks = feedbacks.filter(feedback => feedback.satisfaction <= 2);
  }
}
