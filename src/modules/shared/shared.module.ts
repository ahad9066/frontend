import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from './shared-material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
    declarations: [LoaderComponent, ErrorComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedMaterialModule],
    exports: [LoaderComponent,
        ErrorComponent],
})
export class SharedModule { }
