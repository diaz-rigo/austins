import { CoreComponentsModule } from './core/components/components.module';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CssStyleClass } from '@fortawesome/fontawesome-svg-core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScrollServiceService } from './shared/services/scroll-service.service';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { PedidoFloatComponent } from './core/components/pedido-float/pedido-float.component';
import { ConnectionStatusComponent } from './shared/components/connection-status/connection-status.component';

import { DialogModule } from 'primeng/dialog';
// import AOS from 'aos'; //AOS - 1
@NgModule({
  declarations: [
    AppComponent,ConnectionStatusComponent
  ],
  imports: [
    SocialLoginModule
    ,DialogModule,
    NgxCaptchaModule,
    MatSnackBarModule,
    NgxUiLoaderModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreComponentsModule,HttpClientModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  // providers: [ScrollServiceService], // Asegúrate de proveer el servicio aquí
  providers: [
    ScrollServiceService,PedidoFloatComponent,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }] ,

  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  // ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(

    private ngxLoader: NgxUiLoaderService,
    private PedidoFloatComponent: PedidoFloatComponent,
    ) {
    // this.ngxLoader.start();
    this.PedidoFloatComponent.ngOnInit
  }

  ngOnInit(): void {

  }
 }
