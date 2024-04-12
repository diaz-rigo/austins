import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { ProductListView } from './views/product-list/product-list.view'
// import { ProductCreateView } from './views/product-create/product-create.view';
import { AdminComponent } from './admin.component'
import { AdminCommonsModule } from './commons/commons.module'
import { AdminComponentModule } from './commons/components/components.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { OrderListView } from './views/order-list/order-list.view'
import { VentaListView } from './views/venta-list/venta-list.view'

import { DataGraficaView } from './views/data-grafica/data-grafica.view'

@NgModule({
  declarations: [
    AdminComponent,
    ProductListView,
    OrderListView,
    VentaListView,
    DataGraficaView,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AdminCommonsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
