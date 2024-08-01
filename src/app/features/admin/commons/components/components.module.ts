import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// import {  MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatBadgeModule} from '@angular/material/badge';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Agrega los componentes
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
// import { MatIconModule } from '@angular/material/icon';
// import { ProductListComponent } from './product-list/product-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../services/product.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OpenDeleteConfirmationComponent } from './open-delete-confirmation/open-delete-confirmation.component';
import { CreateProductComponentComponent } from './create-product-component/create-product-component.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DefaultImgModule } from 'src/app/shared/pipes/default-img/default-img.module';

const COMPONENTS = [AdminHeaderComponent,AdminMenuComponent,OpenDeleteConfirmationComponent, CreateProductComponentComponent];

@NgModule({
  declarations: [...COMPONENTS, ],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatDialogModule,
    MatBadgeModule,
    HttpClientModule,
    MatIconModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,DefaultImgModule
  ],
  providers: [
    ProductService, // Agrega ProductService como proveedor aquí
    // ... otros servicios y proveedores si los tienes
  ],
})
export class AdminComponentModule{ }
