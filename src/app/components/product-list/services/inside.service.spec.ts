import { TestBed } from '@angular/core/testing'
import { ProductModel } from 'src/app/models/product'
import { of } from 'rxjs'
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

    // Set a product
    service.setProduct(mockProduct)

    // Get the product
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

    // Set a product
    service.setProduct(mockProduct)

    // Clear the product
    service.clearProduct()

    // The product should not be available after clearing
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

    // Set a product using localStorage
    localStorage.setItem('product-selected-key', JSON.stringify(mockProduct))

    // Clear the subject to simulate no product available in the subject
    service.clearProduct()

    // Get the product
    service.getProduct().subscribe((product) => {
      expect(product).toEqual(mockProduct)
    })
  })
})
