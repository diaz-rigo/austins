import { ContactService } from '../../services/contact.service';
import { Component, OnInit } from '@angular/core';

export interface Contact {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  contact: Contact = { name: '', email: '', message: '', createdAt: new Date() };
  submitted = false;
  approvedContacts: Contact[] = [];

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadApprovedContacts();
  }

  onSubmit() {
    this.contactService.createContact(this.contact).subscribe(response => {
      if (response.success) {
        this.submitted = true;
        this.resetForm();
        this.loadApprovedContacts();
      }
    });
  }

  resetForm() {
    this.contact = { name: '', email: '', message: '', createdAt: new Date() };
  }

  loadApprovedContacts() {
    this.contactService.getApprovedContacts().subscribe(contacts => {
      this.approvedContacts = contacts;
    });
  }

  getPastelColor(name: string): string {
    const pastelColors = ['#AEC6CF', '#FFB347', '#FFD1DC', '#CFCFC4', '#77DD77'];

    // const pastelColors = ['#FFB3BA', '#FFDFBA', '#FFFdBA', '#BAFFC9', '#BAE1FF'];
    const hash = this.hashString(name);
    return pastelColors[hash % pastelColors.length];
  }

  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
