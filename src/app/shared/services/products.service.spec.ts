import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ProductModel } from 'src/app/models/product'
import { ProductService } from './products.service'
import { Environment } from 'src/app/environment/environment'
import { ApiResources } from 'src/app/helpers/api.resources'

describe('ProductService', () => {
  const products: Array<ProductModel> = Array.from({ length: 10 }, (_, index) => ({
    id: index.toString(),
    name: `Product ${index}`,
    description: `Description ${index}`,
    logo: `Logo ${index}`,
    date_release: new Date(),
    date_revision: new Date(),
  }))

  const mockProduct: ProductModel = {
    id: 'productId',
    name: 'Deleted Product',
    description: 'Description of Deleted Product',
    logo: 'http://LogoURL',
    date_release: new Date(),
    date_revision: new Date(),
  }

  let productService: ProductService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    })

    productService = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(productService).toBeTruthy()
  })

  it('should get products', () => {
    productService.getProducts().subscribe((response) => {
      expect(response).toEqual(products)
    })

    const request = httpMock.expectOne(`${Environment.apiUrl}${ApiResources.product.base}`)
    expect(request.request.method).toBe('GET')
    request.flush(products)
  })

  it('should create a product', () => {
    productService.createProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct)
    })

    const request = httpMock.expectOne(`${Environment.apiUrl}${ApiResources.product.base}`)
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toEqual(mockProduct)
    request.flush(mockProduct)
  })

  it('should delete a product', () => {
    const productId = '123'

    productService.deleteProduct(productId).subscribe((response) => {
      expect(response).toBeTruthy()
    })

    const request = httpMock.expectOne(`${Environment.apiUrl}${ApiResources.product.byId(productId)}`)
    expect(request.request.method).toBe('DELETE')
    request.flush({})
  })

  it('should validate a product', () => {
    const productId = '456'

    productService.validateProduct(productId).subscribe((response) => {
      expect(response).toBeTruthy()
    })

    const request = httpMock.expectOne(`${Environment.apiUrl}${ApiResources.product.validateById(productId)}`)
    expect(request.request.method).toBe('GET')
    request.flush(true)
  })

  it('should update a product', () => {
    productService.updateProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct)
    })

    const request = httpMock.expectOne(`${Environment.apiUrl}${ApiResources.product.base}`)
    expect(request.request.method).toBe('PUT')
    expect(request.request.body).toEqual(mockProduct)
    request.flush(mockProduct)
  })
})
