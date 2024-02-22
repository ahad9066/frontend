import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HttpReqResInterceptor } from 'src/modules/auth/http-req-res.interceptor';
import { CartComponent } from './cart/cart.component';
import { ApiService } from './services/api.service';
import { CartState } from './store/state/cart.state';
import { SharedModule } from 'src/modules/shared/shared.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.service';

export function ModuleConfigFactory(): AuthModule {
  return {
    baseURL: environment.baseURL,
    spaURL: environment.spaURL,
  };
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CartComponent,
    MyOrdersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    NgxsModule.forRoot([CartState], {
      developmentMode: !environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    ToastrModule.forRoot(),
    ToastContainerModule,
    HttpClientModule,
    AuthModule.forRoot(),
    SharedModule
  ],
  providers: [
    ApiService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqResInterceptor,
      multi: true,
    },
    {
      provide: AuthModule,
      useFactory: ModuleConfigFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
