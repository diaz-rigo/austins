// feedback.model.ts

export interface Cliente {
  name: string;
  email: string;
}

export interface Feedback {
  datosCliente: Cliente;
  _id: string;
  npsScore: number;
  easeOfUse: number;
  satisfaction: number;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackSummary {
  totalFeedbacks: number;
  averageScores: {
    npsScore: number;
    easeOfUse: number;
    satisfaction: number;
  };
  feedbacks: Feedback[];
}
