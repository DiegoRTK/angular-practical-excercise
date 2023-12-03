import { HttpErrorResponse } from '@angular/common/http'
import { Component, HostListener, OnInit } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { finalize } from 'rxjs'
import { ProductModel } from 'src/app/models/product'
import { EVENT_BUTTON_ENUM } from 'src/app/helpers/enum'
import { PageResources } from 'src/app/helpers/page.resources'
import { ProductService } from 'src/app/shared/services/products.service'
import { InsideProductService } from './services/inside.service'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public productsLst: Array<ProductModel> = []

  public faCircleInfo = faCircleInfo

  public isLoading = false

  public message = "Cargando..."

  public filters = this.fb.group({
    searchInput: new FormControl(''),
    selectProducts: new FormControl(5)
  })

  public showModal = false

  public showDropdown = false

  public isDeleteModal = false

  public selectedNameProduct = ''

  public eventEnum = EVENT_BUTTON_ENUM

  public isError = false

  public alertMessage = ''

  private productsLstBU: Array<ProductModel> = []

  private productId = ''

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private productInsideService: InsideProductService
  ) { }

  ngOnInit(): void {
    this.filters.valueChanges.subscribe(value => {
      const number = Number(value.selectProducts)
      if (value.searchInput && value.selectProducts) {
        this.productsLst = this.productsLstBU.slice(0, number)
        this.productsLst = this.productsLstBU.filter(row =>
        (row.name.toLowerCase().includes(value.searchInput?.toLowerCase() as string) ||
          row.description.toLowerCase().includes(value.searchInput?.toLowerCase() as string))
        )
      }
      else if (value.searchInput) {
        this.productsLst = this.productsLstBU.filter(row =>
        (row.name.toLowerCase().includes(value.searchInput?.toLowerCase() as string) ||
          row.description.toLowerCase().includes(value.searchInput?.toLowerCase() as string))
        )
      } else if (value.selectProducts) {
        this.productsLst = this.productsLstBU.slice(0, number)
      } else {
        this.productsLst = this.productsLstBU
      }
    })

    this.getProducts()
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement
    const isDropdownClicked = target.closest('.dropdown') !== null
    if (!isDropdownClicked) {
      this.showDropdown = false
    }
  }

  public createProduct(): void {

    this.router.navigateByUrl(`${PageResources.product.base}/create`)
  }

  public filterProducts(event: Event): void {
    const value = (event.target as HTMLSelectElement).value
    const number = Number(value)
    this.productsLst = this.productsLstBU.slice(0, number)
  }

  public searchProducts(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.productsLst = this.productsLstBU.filter(row => (value.includes(row.name) || value.includes(row.description)))
  }

  public toggleDropdown(productName: string): void {
    if (!productName) {
      this.showDropdown = false
    } else if (this.showDropdown && this.selectedNameProduct === productName) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
      this.selectedNameProduct = productName
    }
  }


  public openModal(): void {
    this.showModal = true
  }

  public closeModal(): void {
    this.showModal = false
  }

  public handleDropClick(product: ProductModel, event: EVENT_BUTTON_ENUM): void {
    switch (event) {
      case EVENT_BUTTON_ENUM.DELETE:
        this.showModal = true
        this.isDeleteModal = true
        this.productId = product.id
        break
      case EVENT_BUTTON_ENUM.UPDATE:
        this.router.navigateByUrl(`${PageResources.product.base}/edit`)
        this.productInsideService.setProduct(product)
        break
      case EVENT_BUTTON_ENUM.VIEW:
        this.router.navigateByUrl(`${PageResources.product.base}/view`)
        this.productInsideService.setProduct(product)
        break
    }
  }

  public deleteProduct(): void {
    this.isLoading = true
    this.message = 'Eliminando producto...'
    this.productService.deleteProduct(this.productId).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: () => {
        this.showModal = true
        this.isDeleteModal = false
        this.productsLst = this.productsLst.filter(row => row.id !== this.productId)
        this.productsLstBU = this.productsLstBU.filter(row => row.id !== this.productId)
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          this.showModal = true
          this.isDeleteModal = false
          this.productsLst = this.productsLst.filter(row => row.id !== this.productId)
          this.productsLstBU = this.productsLstBU.filter(row => row.id !== this.productId)
        }
        else {
          this.isError = true
          this.alertMessage = error.error
          this.showModal = true
        }
      }
    })
  }

  private getProducts(): void {
    this.isLoading = true
    this.message = 'Cargando productos...'
    this.productService.getProducts().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (value) => {
        this.productsLst = value
        this.productsLstBU = [...this.productsLst]
        this.productsLst = this.productsLst.slice(0, 5)
      }
    })
  }
}