import { Selector } from '@ngxs/store';
import { ProductsState, ProductsStateModel } from '../state/products.state';

export class ProductsSelectors {
    @Selector([ProductsState])
    static GetFeTiProducts(state: ProductsStateModel) {
        return state.products;
    }
}
