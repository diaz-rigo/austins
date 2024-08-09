import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContactService } from 'src/app/features/portal/commons/services/contact.service';
import { Contact } from 'src/app/features/portal/models/contact';

@Component({
  selector: 'app-coments',
  templateUrl: './coments.view.html',
  styleUrls: ['./coments.view.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComentsView implements OnInit {
  pendingContacts: Contact[] = [];
  approvedContacts: Contact[] = []; // Nuevo array para los contactos aprobados

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.getPendingContacts();
    this.getApprovedContacts(); // Obtener también los contactos aprobados
  }

  getPendingContacts(): void {
    this.contactService.getPendingContacts().subscribe((contacts: Contact[]) => {
      this.pendingContacts = contacts;
    });
  }

  getApprovedContacts(): void {
    this.contactService.getApprovedContacts().subscribe((contacts: Contact[]) => {
      this.approvedContacts = contacts;
    });
  }

  approveContact(id: string): void {
    this.contactService.approveContact(id).subscribe(() => {
      this.getPendingContacts(); // Actualiza la lista después de aprobar
      this.getApprovedContacts(); // Actualiza la lista de aprobados también
    });
  }
}
