import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './helpers/http-interceptor';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AddEditProductComponent } from './components/product-list/add-edit-product/add-edit-product.component'
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponentComponent } from './shared/components/loading-component/loading-component.component';
import { ModalComponentComponent } from './shared/components/modal-component/modal-component.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    AddEditProductComponent,
    LoadingComponentComponent,
    ModalComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faInfoCircle)
  }
}
