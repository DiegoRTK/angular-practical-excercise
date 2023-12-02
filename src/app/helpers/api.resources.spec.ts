import { ApiResources } from "./api.resources"

describe('ApiResources configuration', () => {
  it('should have product property', () => {
    expect(ApiResources).toBeDefined()
    expect(ApiResources.product).toBeDefined()
  })

  it('should have the correct values for product properties', () => {
    const { product } = ApiResources

    expect(product.base).toBe('bp/products')
    expect(product.byId('123')).toBe('bp/products?id=123')
    expect(product.validateById('456')).toBe('bp/products/verification?id=456')
  })
})
