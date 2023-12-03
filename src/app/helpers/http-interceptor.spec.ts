import { TestBed, inject } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { RequestInterceptor } from './http-interceptor'

describe('RequestInterceptor', () => {
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
      ],
    })
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('should add authorId header to the request', inject([HttpClient], (http: HttpClient) => {
    const url = '/api/data'
    http.get(url).subscribe()
    const request = httpMock.expectOne(url)
    expect(request.request.headers.has('authorId')).toBeTruthy()
    expect(request.request.headers.get('authorId')).toEqual('405')
    request.flush({})
  }))

  afterEach(() => {
    httpMock.verify()
  })
})
