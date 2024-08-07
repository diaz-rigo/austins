import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { PoliticaComponent } from './politica/politica.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInService } from 'src/app/features/auth/commons/services/sign-in.service';
import { HttpClientModule } from '@angular/common/http';
import { CookiesComponent } from './cookies/cookies.component';
import { BtnFloatComponent } from './btn-float/btn-float.component';
import { ChatComponent } from './chat/chat.component';
// import {  } from './components.component';
import { StepsModule } from 'primeng/steps';
import { StepsComponent } from './steps/steps.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
// import { SignInView } from 'src/app/features/auth/views/sign-in/sign-in.view';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DefaultImgModule } from 'src/app/shared/pipes/default-img/default-img.module';
// import { DefaultImgModule } from 'src/app/shared/pipe/default-img/default-img.module';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

import { SliderModule } from 'primeng/slider';
import { PedidoFloatComponent } from './pedido-float/pedido-float.component';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { PdfGenerateComponent } from './pdf-generate/pdf-generate.component';
import { ProfileComponent } from 'src/app/core/components/profile/profile.component';
import { PortalModule } from 'src/app/features/portal/portal.module';
import { ComprasComponent } from './compras/compras.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductComponent } from 'src/app/features/portal/commons/components/product/product.component';
@NgModule({
  declarations: [
    ChatComponent,
    HeaderComponent,
    FooterComponent,
    PoliticaComponent,
    CookiesComponent,
    BtnFloatComponent,
    StepsComponent,
    ProgressBarComponent,
    PedidoFloatComponent,
    PdfGenerateComponent,ProfileComponent, ComprasComponent, PedidosComponent,
  ],
  exports: [
    TimelineModule ,
    // PoliticaComponent,
    PedidoFloatComponent,
    SliderModule,
    ConfirmDialogModule,
    ToastModule,
    ConfirmPopupModule,
    DefaultImgModule,
    ChatComponent,
    BtnFloatComponent,
    HeaderComponent,
    FooterComponent,
    PoliticaComponent,
    CookiesComponent,
    StepsComponent,
    ProgressBarComponent,
    PdfGenerateComponent
  ],
  imports: [
    InputNumberModule,
    TimelineModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ToastModule,
    // BrowserModule,
    CalendarModule,
    SliderModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DefaultImgModule,
    DynamicDialogModule,
    DialogModule,
    BadgeModule,
    AnimateOnScrollModule,
    AvatarGroupModule,
    AvatarModule,
    FormsModule,
    StepsModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    MatDialogModule,
    MatBadgeModule,
    HttpClientModule,
    SidebarModule,
    ToggleButtonModule,
    ButtonModule,
  ],
  providers: [SignInService], // Asegúrate de incluir SignInService en la lista de providers.
})
export class CoreComponentsModule {}
