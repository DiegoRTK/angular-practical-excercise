import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageResources } from './helpers/page.resources'
import { ProductListComponent } from './components/product-list/product-list.component'
import { AddEditProductComponent } from './components/product-list/add-edit-product/add-edit-product.component'

const routes: Routes = [
  {
    path: PageResources.product.home,
    component: ProductListComponent
  },
  {
    path: `${PageResources.product.base}/:option`,
    component: AddEditProductComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
