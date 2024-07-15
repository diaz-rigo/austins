import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-orderview',
  templateUrl: './orderview.view.html',
  styleUrls: ['./orderview.view.scss'],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class OrderviewView implements OnInit {
  sessionInit = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.sessionInit = true;
    }
  }
}
