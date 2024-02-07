import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class ModuleConfig {
    public baseURL: string;
    public spaURL: string;
    public productsBaseUrl: string;
}

@Injectable()
export class ApiService {
    baseURL: string;
    constructor(private httpClient: HttpClient, options: ModuleConfig) {
        this.baseURL = options.baseURL;
    }

    // tslint:disable-next-line: typedef
    public getProducts() {
        return this.httpClient.get(`${environment.productsBaseUrl}/feTi`);
    }

}

