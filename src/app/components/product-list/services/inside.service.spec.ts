import { TestBed } from '@angular/core/testing'
import { ProductModel } from 'src/app/models/product'
import { InsideProductService } from './inside.service'

describe('InsideProductService', () => {
  let service: InsideProductService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsideProductService],
    })
    service = TestBed.inject(InsideProductService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should set and get a product', () => {
    const mockProduct: ProductModel = {
      id: '1',
      name: 'Test Product',
      description: 'Description',
      logo: 'Logo URL',
      date_release: new Date(),
      date_revision: new Date(),
    }
    service.setProduct(mockProduct)
    service.getProduct().subscribe((product) => {
      expect(product).toEqual(mockProduct)
    })
  })

  it('should clear a product', () => {
    const mockProduct: ProductModel = {
      id: '1',
      name: 'Test Product',
      description: 'Description',
      logo: 'Logo URL',
      date_release: new Date(),
      date_revision: new Date(),
    }
    service.setProduct(mockProduct)
    service.clearProduct()
    service.getProduct().subscribe((product) => {
      expect(product).toBeNull()
    })
  })

  it('should get a product from localStorage if not available in subject', () => {
    const mockProduct: ProductModel = {
      id: '1',
      name: 'Test Product',
      description: 'Description',
      logo: 'Logo URL',
      date_release: new Date(),
      date_revision: new Date(),
    }

    localStorage.setItem('product-selected-key', JSON.stringify(mockProduct))
    service.clearProduct()
    service.getProduct().subscribe((product) => {
      expect(product).toEqual(mockProduct)
    })
  })
})
