import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { HomeViews } from './views/home/home.views';
import { PoliticaPrivView } from './views/politica-priv/politica-priv.view';
import { AcercaDeView } from './views/acerca-de/acerca-de.view';
import { DetailViews } from './views/detail/detail.views';
import { PoliticaCookiesView } from './views/politica-cookies/politica-cookies.view';
import { TerminosCondicionesView } from './views/terminos-condiciones/terminos-condiciones.view';
import { NotFondViews } from './views/not-fond/not-fond.views';
import { UnknownView } from './views/unknown/unknown.view';
import { PreguntasFreqView } from './views/preguntas-freq/preguntas-freq.view';
import { NoConectView } from './views/no-conect/no-conect.view';

const routes: Routes = [
  {
    path:'',redirectTo:'home' ,pathMatch:'full'
  },
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: 'home',
        component: HomeViews,
      },
      // {
      //   path: 'order-acc',
      //   component: AccepOrderComponent,
      // },
      // {
      //   path: 'detail',
      //   component: DetailViews,
      // },
      {
        path: 'detail/:id',
        component: DetailViews,
      },
      {
        title:"Politica |",
        path: 'politica',
        component: PoliticaPrivView,
      },
      {
        title:"Politica |Cookies",
        path: 'cookies',
        component: PoliticaCookiesView,
      },
      {
        title:"Terminos |Condiciones",
        path: 'Terminos',
        component: TerminosCondicionesView,
      },
      {
        title:"preguntas |frecuentes",
        path: 'faq',
        component: PreguntasFreqView,
      },
      {
        title:"Acerca de |",
        path: 'acercade',
        component: AcercaDeView,
      },
      {
        title:"404",
        path: 'not-found',
        component: NotFondViews,
      },
      {
        title:"500",
        path: 'unknown',
        component: UnknownView ,
      },
      {
        title:"500",
        path: 'NoConectView',
        component: NoConectView ,
      },
      {
        title:"404",
        path: '**',
        component: NotFondViews,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
