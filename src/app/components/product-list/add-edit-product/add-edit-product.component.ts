import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription, finalize } from 'rxjs'
import { PageResources } from 'src/app/helpers/page.resources'
import { ProductService } from 'src/app/shared/services/products.service'
import { InsideProductService } from '../services/inside.service'

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  public isLoading = false

  public productForm: FormGroup = this.fb.group({
    id: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    logo: new FormControl('', [Validators.required, this.urlValidator]),
    date_release: [null, [Validators.required, this.minDateValidator.bind(this)]],
    date_revision: new FormControl(null, Validators.required)
  })

  public showModal = false

  public alertMessage = ''

  public message = ''

  public activatedRouteSubscription!: Subscription

  public option = ''

  public minDate = new Date()

  public isViewMode = false

  public resetFormMessage = false

  public creatingEditingModal = false

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productInsideService: InsideProductService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.option = params['option']
      if (this.option && this.option !== 'create') {
        if (this.option === 'view') this.isViewMode = true
        this.productInsideService.getProduct().subscribe(value => {
          this.productForm.setValue(value)
          this.productForm.get('date_release')?.setValue(this.parseDateToString(value.date_release))
          this.productForm.get('date_revision')?.setValue(this.parseDateToString(value.date_revision))
        })
        if (!this.productForm.get('id')?.value) {
          this.router.navigateByUrl(PageResources.product.home)
        }
      }
    })
    this.productForm.get('date_release')?.valueChanges.subscribe((date: string) => {
      const datePlusYear = date ? new Date(date) : null
      if (datePlusYear) {
        datePlusYear.setFullYear(datePlusYear.getFullYear() + 1)
        this.productForm.get('date_revision')?.setValue(datePlusYear.toISOString().split('T')[0])
      } else {
        this.productForm.get('date_revision')?.setValue('')
      }
    })
    this.minDate.setHours(0, 0, 0, 0)
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe()
    this.productInsideService.clearProduct()
  }

  public save(): void {
    if (this.productForm.invalid) {
      this.productForm.updateValueAndValidity()
      this.productForm.markAllAsTouched()
      return
    }
    if (this.option === 'edit') {
      this.isLoading = true
      this.message = 'Actualizando producto...'
      this.productService.updateProduct(this.productForm.value).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (value) => {
            this.creatingEditingModal = true
            this.alertMessage = `Se ha actualizado el producto ${value.name} correctamente`
            this.showModal = true
          },
          error: (error: HttpErrorResponse) => {
            this.showModal = true
            this.alertMessage = error.error
          }
        })
    }
    else {
      this.isLoading = true
      this.message = 'Creando producto...'
      this.productService.validateProduct(this.productForm.get('id')?.value).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (exists) => {
            if (exists) {
              this.showModal = true
              this.alertMessage = `Ya existe un producto con el ID ${this.productForm.get('id')?.value}`
            }
            else {
              this.isLoading = true
              this.message = 'Creando producto...'
              this.productService.createProduct(this.productForm.value).pipe(finalize(() => this.isLoading = false)).subscribe({
                next: () => {
                  this.creatingEditingModal = true
                  this.showModal = true
                  this.alertMessage = 'Producto creado correctamente.'
                },
                error: (error: HttpErrorResponse) => {
                  this.showModal = true
                  this.alertMessage = error.error
                }
              })
            }
          },
          error: (error: HttpErrorResponse) => {
            this.showModal = true
            this.alertMessage = error.error
          }
        })
    }
  }

  public closeModal(cancelBtn = false): void {
    this.showModal = false
    if (this.resetFormMessage && !cancelBtn) this.cleanForm()
    if (this.creatingEditingModal) this.router.navigateByUrl(PageResources.product.home)
  }

  public resetForm(): void {
    this.showModal = true
    this.alertMessage = '¿Estás seguro de reiniciar el formulario?'
    this.resetFormMessage = true
  }

  public cleanForm(): void {
    this.productForm.controls['name'].reset()
    this.productForm.controls['description'].reset()
    this.productForm.controls['logo'].reset()
    this.productForm.controls['date_release'].reset()
    this.productForm.controls['date_revision'].reset()
    this.productForm.markAsPristine()
    this.productForm.markAsUntouched()
  }

  private minDateValidator(control: FormControl): { minDate: string } | null {
    const selectedDate = control.value
    const selectedDateObject = new Date(selectedDate + 'T00:00:00')
    selectedDateObject.setHours(0, 0, 0, 0)
    if (selectedDateObject && selectedDateObject >= this.minDate) {
      return null
    }
    return { 'minDate': 'La fecha de liberación debe ser mayor o igual a la fecha actual' }
  }

  private parseDateToString(date: Date): string {
    const dateStr = String(date)
    return dateStr.split('T')[0]
  }

  private urlValidator(control: FormControl): { [key: string]: any } | null {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/
    return urlPattern.test(control.value) ? null : { invalidUrl: true }
  }
}