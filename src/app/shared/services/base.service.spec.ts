import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { BaseService } from './base.service'
import { Environment } from 'src/app/environment/environment'

describe('BaseService', () => {
  let service: BaseService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BaseService],
    })

    service = TestBed.inject(BaseService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should send a POST request', () => {
    const route = '/api/data'
    const body = { key: 'value' }

    service.httpPost(route, body).subscribe()

    const request = httpMock.expectOne(`${Environment.apiUrl}${route}`)
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toBe(body)

    request.flush({})
  })

  it('should send a GET request', () => {
    const route = '/api/data'

    service.httpGet(route).subscribe()

    const request = httpMock.expectOne(`${Environment.apiUrl}${route}`)
    expect(request.request.method).toBe('GET')

    request.flush({})
  })

  it('should send a DELETE request', () => {
    const route = '/api/data'

    service.httpDelete(route).subscribe()

    const request = httpMock.expectOne(`${Environment.apiUrl}${route}`)
    expect(request.request.method).toBe('DELETE')

    request.flush({})
  })

  it('should send a PUT request', () => {
    const route = '/api/data'
    const body = { key: 'value' }

    service.httpPut(route, body).subscribe()

    const request = httpMock.expectOne(`${Environment.apiUrl}${route}`)
    expect(request.request.method).toBe('PUT')
    expect(request.request.body).toBe(body)

    request.flush({})
  })
})
