import { Component, OnInit } from '@angular/core'
import { ProfileService } from 'src/app/shared/services/profile.service'
import { SessionService } from '../../services/session.service'
import { UserProfile } from 'src/app/shared/models/userPROFILE.model'

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  // userId: string = '6694467053f39eebd83990e3' // ID del usuario
  pedidos: any[] = []
  user: UserProfile | undefined;
  constructor(
    private pedidosService: ProfileService,
    private sessionService: SessionService,
  ) {
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.pedidosService.getPedidos(userData.id).subscribe(
        (data) => {
          this.pedidos = data
        },
        (error) => {
          console.error('Error al obtener los pedidos:', error)
        },
      )
    }
  }

  ngOnInit(): void {
    this.getPedidos()
  }

  getPedidos(): void {
    // this.pedidosService.getPedidos(this.userId).subscribe(
    //   (data) => {
    //     this.pedidos = data
    //   },
    //   (error) => {
    //     console.error('Error al obtener los pedidos:', error)
    //   },
    // )
  }
}
