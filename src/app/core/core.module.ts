import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PoliticaComponent } from './components/politica/politica.component';

import { DefaultImgModule } from 'src/app/shared/pipes/default-img/default-img.module';
import { PortalModule } from '@angular/cdk/portal';
// import { DefaultImgModule } from 'src/app/shared/pipe/default-img/default-img.module';


@NgModule({
  // declarations: [
  //   PoliticaComponent
  // ],
  imports: [

    CommonModule,DefaultImgModule,
  ]
})
export class CoreModule { }
