import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';
import { ModuleConfig, ProductsModule } from 'src/modules/products/products.module';

export function ModuleConfigFactory(): ModuleConfig {
    console.log("asdfadsfsafsadf")
    return {
        baseURL: environment.baseURL,
        spaURL: environment.spaURL,
        productsBaseUrl: environment.productsBaseUrl
    };
}

@NgModule({
    imports: [ProductsModule.forRoot()],
    providers: [
        {
            provide: ModuleConfig,
            useFactory: ModuleConfigFactory
        }
    ]
})

export class ProductsWrapperModule { }



//