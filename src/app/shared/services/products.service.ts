import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { Observable } from "rxjs";
import { ProductModel } from "src/app/models/product";
import { ApiResources } from "src/app/helpers/api.resources";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService {
    public getProducts(): Observable<Array<ProductModel>> {
        return this.httpGet(ApiResources.product.base)
    }

    public createProduct(product: ProductModel): Observable<ProductModel> {
        return this.httpPost(ApiResources.product.base, product)
    }

    public deleteProduct(productId: string): Observable<ProductModel> {
        return this.httpDelete(ApiResources.product.byId(productId))
    }

    public validateProduct(productId: string): Observable<boolean> {
        return this.httpGet(ApiResources.product.validateById(productId))
    }

    public updateProduct(product: ProductModel): Observable<ProductModel> { 
        return this.httpPut(ApiResources.product.base, product)
    }
}