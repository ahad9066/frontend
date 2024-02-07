// import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { ApiService, ModuleConfig } from './services/api.service';
// import { AuthGuard } from './guards/auth-guard.service';

// export { ModuleConfig };
// export interface ModuleOptions {
//     baseURL?: string;
//     spaURL?: string;
//     refreshPath?: string;
// }

// export const FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<ModuleOptions>(
//     'forRoot() Module configuration'
// );

// @NgModule({
//     declarations: [],
//     imports: [
//         CommonModule,
//         FormsModule,
//         ReactiveFormsModule,
//     ],
// })
// export class AuthModule {
//     static forRoot(options?: ModuleOptions): ModuleWithProviders<AuthModule> {
//         return {
//             ngModule: AuthModule,
//             providers: [
//                 ApiService,
//                 AuthGuard,
//                 {
//                     provide: FOR_ROOT_OPTIONS_TOKEN,
//                     useValue: options,
//                 },
//                 {
//                     provide: ModuleConfig,
//                     useFactory: provideMyServiceOptions,
//                     deps: [FOR_ROOT_OPTIONS_TOKEN],
//                 },
//             ],
//         };
//     }
// }

// export function provideMyServiceOptions(options?: ModuleOptions): ModuleConfig {
//     const myServiceOptions = new ModuleConfig();
//     if (options) {
//         if (typeof options.baseURL === 'string') {
//             myServiceOptions.baseURL = options.baseURL;
//         }
//         if (typeof options.spaURL === 'string') {
//             myServiceOptions.spaURL = options.spaURL;
//         }
//         if (typeof options.refreshPath === 'string') {
//             myServiceOptions.refreshPath = options.refreshPath;
//         }
//     }
//     return myServiceOptions;
// }
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService, ModuleConfig } from './services/api.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { NgxsModule } from '@ngxs/store';
import { AuthState } from './store/state/auth.state';
import { SharedModule } from '../shared/shared.module';
import { AuthMaterialModule } from './auth-material.module';
import { AuthRoutingModule } from './auth-routing.module';


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
        LoginComponent,
        SignupComponent
    ],
    exports: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthMaterialModule,
        AuthRoutingModule,
        NgxsModule.forFeature([AuthState]),
        SharedModule
    ],
})
export class AuthModule {
    static forRoot(options?: ModuleOptions): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
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

