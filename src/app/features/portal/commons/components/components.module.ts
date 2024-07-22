import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { DetailInfoComponent } from './detail-info/detail-info.component';
import { DetailImgComponent } from './detail-img/detail-img.component';





import { MaterialModule } from '../material/material.module';
// import { DefaultImgModule } from 'src/app/shared/pipe/default-img/default-img.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { DefaultImgModule } from 'src/app/shared/pipes/default-img/default-img.module';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { CatalogoVista2Component } from './catalogo-vista2/catalogo-vista2.component';
import { PostComponent } from './post/post.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { ContactoComponent } from './contacto/contacto.component';
const COMPONENTS = [ProductComponent,DetailImgComponent, DetailInfoComponent,CatalogoComponent,CatalogoVista2Component,PostComponent,ProductReviewComponent,ContactoComponent]; // Agrega los componentes

@NgModule({
  declarations: [...COMPONENTS,FilterPipe  ],
  exports: [...COMPONENTS],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DefaultImgModule,

    // Agrega aquí otros módulos compartidos si es necesario
  ]
})
export class PortalComponentsModule { }
