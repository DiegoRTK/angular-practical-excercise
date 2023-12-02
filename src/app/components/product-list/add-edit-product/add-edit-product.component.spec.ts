import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AddEditProductComponent } from './add-edit-product.component'
import { AppModule } from 'src/app/app.module'
import { PageResources } from 'src/app/helpers/page.resources'
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs'
import { ProductService } from 'src/app/shared/services/products.service'
import { ProductModel } from 'src/app/models/product'
import { jest } from '@jest/globals'
import { Validators } from '@angular/forms'

describe('AddEditProductComponent', () => {
  const mockProduct: ProductModel = {
    id: 'productId',
    name: 'Deleted Product',
    description: 'Description of Deleted Product',
    logo: 'http://LogoURL',
    date_release: new Date(),
    date_revision: new Date(),
  }
  let component: AddEditProductComponent
  let fixture: ComponentFixture<AddEditProductComponent>
  let productServiceMock: jest.Mocked<ProductService>

  beforeEach(async () => {
    productServiceMock = {
      updateProduct: jest.fn(),
      createProduct: jest.fn(),
      validateProduct: jest.fn()
    } as unknown as jest.Mocked<ProductService>
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      declarations: [AddEditProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
    ],
    }).compileComponents()

    fixture = TestBed.createComponent(AddEditProductComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should validate if initial state is valid', () => {
    expect(component.isLoading).toBeFalsy()
    expect(component.productForm).toBeDefined()
    expect(component.showModal).toBeFalsy()
    expect(component.alertMessage).toBe('')
    expect(component.message).toBe('')
    expect(component.activatedRouteSubscription).toBeUndefined()
    expect(component.option).toBeUndefined()
    expect(component.minDate).toBeDefined()
    expect(component.isViewMode).toBeFalsy()
    expect(component.resetFormMessage).toBeFalsy()
    expect(component.creatingEditingModal).toBeFalsy()
  })

  it('should handle date_release value changes', () => {
    component.productForm.get('date_release')?.setValue('2023-12-02')
    expect(component.productForm.get('date_revision')?.value).toBe('2024-12-02')
  })

  it('should navigate to product home if option is view and ID is missing', () => {
    jest.spyOn(component['router'], 'navigateByUrl')
    component['activatedRoute'].params.subscribe(params => {
      const option = params['option']
      if (option === 'view') {
        expect(component['router'].navigateByUrl).toHaveBeenCalledWith(PageResources.product.home)
      }
    })
  })

  it('should handle save for edit option', () => {
    productServiceMock.updateProduct.mockReturnValue(of(mockProduct))
    component.option = 'edit'
    component.productForm.controls['date_release'].setValidators(Validators.required)
    component.productForm.setValue(mockProduct)
    component.save()
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith(mockProduct)
    expect(component.creatingEditingModal).toBeTruthy()
    expect(component.showModal).toBeTruthy()
  })

  it('should handle save for create option', () => {
    productServiceMock.createProduct.mockReturnValue(of(mockProduct))
    component.option = 'create'
    component.productForm.controls['date_release'].setValidators(Validators.required)
    component.productForm.setValue(mockProduct)
    jest.spyOn(productServiceMock, 'validateProduct')
    productServiceMock.validateProduct.mockReturnValue(of(false))
    component.save()
    expect(productServiceMock.createProduct).toHaveBeenCalledWith(mockProduct)
    expect(component.creatingEditingModal).toBeTruthy()
    expect(component.showModal).toBeTruthy()
  })

  it('should handle error when product exists', () => {
    productServiceMock.createProduct.mockReturnValue(of(mockProduct))
    component.option = 'create'
    component.productForm.controls['date_release'].setValidators(Validators.required)
    component.productForm.setValue(mockProduct)
    jest.spyOn(productServiceMock, 'validateProduct')
    productServiceMock.validateProduct.mockReturnValue(of(true))
    component.save()
    expect(productServiceMock.createProduct).not.toHaveBeenCalled()
    expect(component.showModal).toBeTruthy()
    expect(component.alertMessage).toEqual(`Ya existe un producto con el ID ${component.productForm.get('id')?.value}`)
  })

  it('should handle closeModal without resetting form', () => {
    component.resetFormMessage = true
    component.closeModal()
    expect(component.showModal).toBe(false)
  })

  it('should handle closeModal with resetting form', () => {
    component.resetFormMessage = true
    component.closeModal(true)
    expect(component.showModal).toBe(false)
    })

  it('should reset form', () => {
    component.resetForm()
    expect(component.showModal).toBeTruthy()
    expect(component.alertMessage).toEqual('¿Estás seguro de reiniciar el formulario?')
    expect(component.resetFormMessage).toBeTruthy()
  })

  it('should cleanForm', () => {
    component.cleanForm()
    expect(component.productForm.get('name')?.value).toBeFalsy()
    expect(component.productForm.get('description')?.value).toBeFalsy()
    expect(component.productForm.get('logo')?.value).toBeFalsy()
    expect(component.productForm.get('date_release')?.value).toBeFalsy()
    expect(component.productForm.get('date_revision')?.value).toBeFalsy()
  })
})
