import { Component, OnInit } from '@angular/core';
import { FAQ, FaqService } from 'src/app/features/portal/commons/services/faq.service';

@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.view.html',
  styleUrl: './admin-faq.view.scss'
})
export class AdminFaqView implements OnInit {

  faqs: FAQ[] = [];
  selectedFAQ: FAQ | null = null;

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.loadFAQs();
  }

  // Cargar todas las FAQs
  loadFAQs(): void {
    this.faqService.getFAQs().subscribe((data) => {
      this.faqs = data;
    });
  }

  // Abrir el formulario para crear una nueva FAQ
  openForm(): void {
    this.selectedFAQ = { question: '', answer: '' }; // Limpiar el formulario
  }

  // Editar una FAQ existente
  editFAQ(faq: FAQ): void {
    this.selectedFAQ = { ...faq }; // Clonar el objeto FAQ para evitar modificaciones directas
  }

  // Guardar o actualizar una FAQ
  onSubmit(): void {
    if (this.selectedFAQ!._id) {
      // Actualizar una FAQ existente
      this.faqService.updateFAQ(this.selectedFAQ!._id, this.selectedFAQ!).subscribe(() => {
        this.loadFAQs();
        this.selectedFAQ = null;
      });
    } else {
      // Crear una nueva FAQ
      this.faqService.createFAQ(this.selectedFAQ!).subscribe(() => {
        this.loadFAQs();
        this.selectedFAQ = null;
      });
    }
  }

  // Eliminar una FAQ
  deleteFAQ(id: string): void {
    this.faqService.deleteFAQ(id).subscribe(() => {
      this.loadFAQs();
    });
  }

  // Cancelar la edición/creación
  cancel(): void {
    this.selectedFAQ = null;
  }
}
