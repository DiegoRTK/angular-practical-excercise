import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Environment } from "src/app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    constructor(private http: HttpClient){}

    private baseUrl = Environment.apiUrl

    public httpPost(route:string, body:any): Observable<any> {
        return this.http.post(`${this.baseUrl}${route}`, body)
    }

    public httpGet(route: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${route}`)
    }

    public httpDelete(route: string): Observable<any> { 
        return this.http.delete(`${this.baseUrl}${route}`)
    }

    public httpPut(route: string, body: any): Observable<any> {
        return this.http.put(`${this.baseUrl}${route}`, body)
    }
}