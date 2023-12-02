import { Environment } from './environment'

describe('Environment configuration', () => {
  it('should have production and apiUrl properties', () => {
    expect(Environment).toBeDefined()
    expect(Environment.production).toBeDefined()
    expect(Environment.apiUrl).toBeDefined()
  })

  it('should have the correct values for production and apiUrl', () => {
    expect(Environment.production).toBe('false')
    expect(Environment.apiUrl).toBe('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/')
  })
})
