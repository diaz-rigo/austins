import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './success/success.component';
import { OrderComponent } from './order/order.component';
import { DividerModule } from 'primeng/divider';
import { MaterialModule } from '../material/material.module';
import { OrderOnSessionComponent } from './order-on-session/order-on-session.component';
import { CameraComponent } from './camera/camera.component';
const COMPONENTES = [SuccessComponent,OrderComponent,OrderOnSessionComponent];

@NgModule({
  declarations: [...COMPONENTES, CameraComponent],
  exports: [...COMPONENTES],
  imports: [CommonModule,MaterialModule],
})
export class PAYComponentsModule {}
