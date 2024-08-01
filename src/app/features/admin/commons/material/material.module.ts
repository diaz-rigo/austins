import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatTable, MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import {
  MatOptionModule,
  MatPseudoCheckboxModule,
} from '@angular/material/core'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import { MatChipGrid } from '@angular/material/chips'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { AccordionModule } from 'primeng/accordion'
import { PanelModule } from 'primeng/panel'
import { AvatarModule } from 'primeng/avatar'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ChartModule } from 'primeng/chart'
import { CalendarModule } from 'primeng/calendar'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { SplitterModule } from 'primeng/splitter'
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
// import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { ErrorInterceptor } from 'src/app/shared/interceptor/error.interceptor'
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
@NgModule({
  exports: [ProgressSpinnerModule,InputNumberModule,CheckboxModule,ToastModule,CardModule,
    ChipsModule,
    ChipModule,
    FieldsetModule,
    TagModule,
    ContextMenuModule,
    SidebarModule,
    InputTextareaModule,
    InputTextModule,
    DividerModule,
    SplitterModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    ChartModule,
    PanelModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    AccordionModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class MaterialModule {}
