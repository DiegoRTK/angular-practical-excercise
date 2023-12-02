import { PageResources } from "./page.resources"

describe('PageResources configuration', () => {
  it('should have product property', () => {
    expect(PageResources).toBeDefined()
    expect(PageResources.product).toBeDefined()
  })

  it('should have the correct values for product properties', () => {
    const { product } = PageResources
    expect(product.home).toBe('')
    expect(product.base).toBe('create-product')
  })
})
