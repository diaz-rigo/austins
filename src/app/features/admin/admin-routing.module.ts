import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductListView } from './views/product-list/product-list.view';
// import { ProductCreateView } from './views/product-create/product-create.view';
import { InicioAdView } from './views/incio-ad/incio-ad.view';
import { OrderListView } from './views/order-list/order-list.view';
import { VentaListView } from './views/venta-list/venta-list.view';
import { DataGraficaView } from './views/data-grafica/data-grafica.view';
import { UserListComponent } from './views/user-list/user-list.component';
import { ClasifiModeloView } from './views/clasifi-modelo/clasifi-modelo.view';
import { ComentsView } from './views/coments/coments.view';
import { AdminFaqView } from './views/admin-faq/admin-faq.view';
const routes: Routes = [
  {
    path:'',redirectTo:'inicio' ,pathMatch:'full'
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'inicio',
        component: InicioAdView,
      },
      {
          title:"product|",
        path: 'products-list',
        component: ProductListView,
      },
      {
          title:"order|",
        path: 'order-list',
        component: OrderListView,
      },
      {
          title:"order|",
        path: 'sale-list',
        component: VentaListView,
      },
      {
          title:"data|",
        path: 'ventas-grafica',
        component: DataGraficaView,
      },
      {
          title:"users|",
        path: 'users',
        component: UserListComponent,
      },
      {
          title:"modelo|",
        path: 'clasifica',
        component: ClasifiModeloView,
      },
      {
          title:"comentarios|",
        path: 'comentarios',
        component: ComentsView,
      },
      {
          title:"preguntas frecuentes|",
        path: 'AdminFaqView',
        component: AdminFaqView,
      },

    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
