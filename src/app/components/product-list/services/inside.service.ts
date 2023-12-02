import { Injectable } from "@angular/core"
import { Observable, Subject, of } from "rxjs"
import { ProductModel } from "src/app/models/product"

@Injectable({
    providedIn: 'root'
})
export class InsideProductService {

    private $product = new Subject<ProductModel | null>()

    private productKey = 'product-selected-key'


    public setProduct(product: ProductModel | null): void {
        this.$product.next(product as ProductModel)
        if (product) {
            localStorage.setItem(this.productKey, JSON.stringify(product))
        } else {
            localStorage.removeItem(this.productKey)
        }
    }


    public getProduct(): Observable<ProductModel> {
        const storedProduct = localStorage.getItem(this.productKey) ?? '';
        return storedProduct ? of(JSON.parse(storedProduct)) : this.$product.asObservable()
    }



    public clearProduct(): void {
        const storedProduct = localStorage.getItem(this.productKey)
        if (storedProduct) localStorage.removeItem(this.productKey)
    }
}