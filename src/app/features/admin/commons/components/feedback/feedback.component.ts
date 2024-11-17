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

  // Labels and data for the radar chart
  feedbackRadarChartLabels = ['Puntaje NPS', 'Facilidad de Uso', 'Satisfacción'];
  feedbackRadarChartData: ChartDataset<'radar'>[] = [];
  feedbackRadarChartType: ChartType = 'radar';
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
    npsDistributionChartLabels = ['Negativos', 'Neutros', 'Promotores'];
    npsDistributionChartData: ChartDataset<'pie'>[] = [{ data: [], label: 'Distribución NPS' }];
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
        label: 'Puntuaciones Promedio'
      }
    ];
  }

  updateFeedbackRadarChart(feedbacks: Feedback[]): void {
    this.feedbackRadarChartData = feedbacks.map(feedback => ({
      data: [feedback.npsScore, feedback.easeOfUse, feedback.satisfaction],
      label: `Feedback de ${feedback.datosCliente.name}`
    }));
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
        label: 'Distribución NPS'
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
