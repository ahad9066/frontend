import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable()
export class ApiService {
    constructor(private httpClient: HttpClient) {
    }


    public getCartItems(userId: any) {
        return this.httpClient.get(`${environment.productsBaseUrl}/cart/${userId}`);
    }
    public addToCart(payload) {
        return this.httpClient.post(`${environment.productsBaseUrl}/cart`, payload);
    }


}

