import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { ProductListComponent } from './product-list.component'
import { ProductService } from 'src/app/shared/services/products.service'
import { InsideProductService } from './services/inside.service'
import { EVENT_BUTTON_ENUM } from 'src/app/helpers/enum'
import { ProductModel } from 'src/app/models/product'
import { AppModule } from 'src/app/app.module'
import { RouterTestingModule } from '@angular/router/testing'
import { PageResources } from 'src/app/helpers/page.resources'

describe('ProductListComponent', () => {
  let component: ProductListComponent
  let fixture: ComponentFixture<ProductListComponent>
  let productServiceMock: jest.Mocked<ProductService>
  let routerMock: jest.Mocked<Router>
  const products: Array<ProductModel> = Array.from({ length: 10 }, (_, index) => ({
    id: index.toString(),
    name: `Product ${index}`,
    description: `Description ${index}`,
    logo: `Logo ${index}`,
    date_release: new Date(),
    date_revision: new Date(),
  }))

  beforeEach(() => {
    productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>

    routerMock = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>

    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [AppModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        InsideProductService,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductListComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize productsLst with 5 items', () => {
    productServiceMock.getProducts.mockReturnValue(of(products))
    component.ngOnInit()
    expect(component.productsLst.length).toBe(5)
  })

  it('should handle deleteProduct successfully', () => {
    const productId = '1'
    const deletedProduct: ProductModel = {
      id: productId,
      name: 'Deleted Product',
      description: 'Description of Deleted Product',
      logo: 'Logo URL',
      date_release: new Date(),
      date_revision: new Date(),
    }

    productServiceMock.deleteProduct.mockReturnValue(of(deletedProduct))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.handleDropClick({ id: productId } as any, EVENT_BUTTON_ENUM.DELETE)

    expect(component.isDeleteModal).toBe(true)

    component.deleteProduct()

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(productId)
    expect(component.showModal).toBe(true)
    expect(component.isDeleteModal).toBe(false)
    expect(component.productsLst).not.toContainEqual(expect.objectContaining({ id: productId }))
  })

  it('should filter products based on search input', () => {
    productServiceMock.getProducts.mockReturnValue(of(products))
    component.ngOnInit()
    component.filters.get('searchInput')?.setValue('Product 1')
    component.filters.get('searchInput')?.updateValueAndValidity()
    expect(component.productsLst.length).toBe(1)
    expect(component.productsLst[0].name).toBe('Product 1')
  })

  it('should filter products based on selected number of products', () => {
    productServiceMock.getProducts.mockReturnValue(of(products))
    component.ngOnInit()
    component.filters.get('selectProducts')?.setValue(2)
    component.filters.get('selectProducts')?.updateValueAndValidity()
    expect(component.productsLst.length).toBe(2)
  })

  it('should close modal', () => {
    component.closeModal()
    expect(component.showModal).toBeFalsy()
  })

  it('should open modal', () => {
    component.openModal()
    expect(component.showModal).toBeTruthy()
  })

  it('should handle toggleDropdown and show/hide the dropdown', () => {
    const productName = 'Product 1'
    expect(component.showDropdown).toBe(false)
    component.toggleDropdown(productName)
    expect(component.showDropdown).toBe(true)
    expect(component.selectedNameProduct).toBe(productName)
    component.toggleDropdown(productName)
    expect(component.showDropdown).toBe(false)
    component.toggleDropdown('Product 2')
    expect(component.showDropdown).toBe(true)
    expect(component.selectedNameProduct).toBe('Product 2')
  })

  it('should navigate to create product page when createProduct is called', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigateByUrl')
    component.createProduct()
    expect(navigateSpy).toHaveBeenCalledWith(`${PageResources.product.base}/create`)
  })


  it('should set isDeleteModal to true and productId when handleDropClick is called with EVENT_BUTTON_ENUM.DELETE', () => {
    const product: ProductModel = {
      id: '1', name: 'Product 1', description: 'Description 1',
      logo: '',
      date_release: new Date(),
      date_revision: new Date()
    }
    component.handleDropClick(product, EVENT_BUTTON_ENUM.DELETE)
    expect(component.isDeleteModal).toBe(true)
    expect(component['productId']).toBe(product.id)
  })

  it('should navigate to edit page and set product when handleDropClick is called with EVENT_BUTTON_ENUM.UPDATE', () => {
    const product: ProductModel = {
      id: '1', name: 'Product 1', description: 'Description 1',
      logo: '',
      date_release: new Date(),
      date_revision: new Date()
    }
    const navigateSpy = jest.spyOn(component['router'], 'navigateByUrl')
    const setProductSpy = jest.spyOn(component['productInsideService'], 'setProduct')

    component.handleDropClick(product, EVENT_BUTTON_ENUM.UPDATE)

    expect(navigateSpy).toHaveBeenCalledWith(`${PageResources.product.base}/edit`)
    expect(setProductSpy).toHaveBeenCalledWith(product)
  })


})
