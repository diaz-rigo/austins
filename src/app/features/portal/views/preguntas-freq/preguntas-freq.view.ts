import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { FAQ, FaqService } from '../../commons/services/faq.service';
interface FaqItem {
  question: string;
  answer: string;
  expanded: boolean;
}

@Component({
  selector: 'app-preguntas-freq',
  templateUrl: './preguntas-freq.view.html',
  styleUrls: ['./preguntas-freq.view.scss'],
  animations: [
    trigger('dialogFadeInOut', [
      state('void', style({ transform: 'scale(0)', opacity: 0 })),
      transition(':enter', [
        animate(
          '1000ms ease-in',
          style({
            transform: 'scale(1)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '1000ms ease-out',
          style({ transform: 'scale(0.5)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class PreguntasFreqView implements OnInit {
  faqList: FaqItem[] = [];

  @ViewChild('faqListContainer') faqListContainer!: ElementRef;

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.loadFAQs();
  }

  // Cargar FAQs desde el servicio
  loadFAQs(): void {
    this.faqService.getFAQs().subscribe((data: FAQ[]) => {
      this.faqList = data.map(faq => ({
        question: faq.question,
        answer: faq.answer,
        expanded: false,  // Por defecto, todas las preguntas están colapsadas
      }));
    });
  }

  toggleFaq(faqItem: FaqItem): void {
    if (faqItem.expanded) {
      this.animateScroll();
      setTimeout(() => {
        faqItem.expanded = !faqItem.expanded;
      }, 1000);
    } else {
      faqItem.expanded = !faqItem.expanded;
      this.animateScroll();
    }
  }

  animateScroll(): void {
    if (this.faqListContainer.nativeElement) {
      this.faqListContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }
}
