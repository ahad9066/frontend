import { Composition, FeTiProduct, Sizes, SubGrades } from "../interfaces/products.interface";

export class ProductsHelper {
    static createFromResponse(data: {}) {
        return {
            id: data['id'] ? data['id'] : null,
            name: data['name'] ? data['name'] : null,
            subGrades: data['subGrades'] ? [...data['subGrades'].map((address: any) => SubGradesHelper.createFromResponse(address))] : []
        } as FeTiProduct;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}

export class SubGradesHelper {
    static createFromResponse(data: {}) {
        return {
            id: data['id'] ? data['id'] : null,
            name: data['name'] ? data['name'] : null,
            composition: data['composition'] ? [...data['composition'].map((comp: any) => CompositionHelper.createFromResponse(comp))] : [],
            sizes: data['sizes'] ? [...data['sizes'].map((size: any) => SizesHelper.createFromResponse(size))] : [],
            price: data['price'] ? data['price'] : null
        } as SubGrades;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}


export class CompositionHelper {
    static createFromResponse(data: {}) {
        return {
            metalID: data['metalID'] ? data['metalID'] : null,
            metalName: data['metalName'] ? data['metalName'] : null,
            percentage: data['percentage'] ? data['percentage'] : null,
        } as Composition;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}


export class SizesHelper {
    static createFromResponse(data: {}) {
        return {
            id: data['id'] ? data['id'] : null,
            name: data['name'] ? data['name'] : null,
            stockCount: data['stockCount'] ? data['stockCount'] : null,
        } as Sizes;
    }
    static toRequest(addone) {
        const data = this.createFromResponse(addone);
        return Object.assign(data, {});
    }
}