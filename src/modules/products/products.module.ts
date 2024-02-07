import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService, ModuleConfig } from './services/api.service';

import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { ProductsState } from './store/state/products.state';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SharedMaterialModule } from '../shared/shared-material.module';


export { ModuleConfig };
export interface ModuleOptions {
    baseURL?: string;
    spaURL?: string;
}

export const FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<ModuleOptions>(
    'forRoot() Module configuration'
);

@NgModule({
    declarations: [
        ProductsComponent,
        ProductDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProductsRoutingModule,
        NgxsModule.forFeature([ProductsState]),
        SharedModule,
        SharedMaterialModule
    ],
})
export class ProductsModule {
    static forRoot(options?: ModuleOptions): ModuleWithProviders<ProductsModule> {
        return {
            ngModule: ProductsModule,
            providers: [
                ApiService,
                {
                    provide: FOR_ROOT_OPTIONS_TOKEN,
                    useValue: options,
                },
                {
                    provide: ModuleConfig,
                    useFactory: provideMyServiceOptions,
                    deps: [FOR_ROOT_OPTIONS_TOKEN],
                },
            ],
        };
    }
}

export function provideMyServiceOptions(options?: ModuleOptions): ModuleConfig {
    const myServiceOptions = new ModuleConfig();
    if (options) {
        if (typeof options.baseURL === 'string') {
            myServiceOptions.baseURL = options.baseURL;
        }
        if (typeof options.spaURL === 'string') {
            myServiceOptions.spaURL = options.spaURL;
        }
    }
    return myServiceOptions;
}

