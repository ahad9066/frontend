import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private itemListSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public itemList$: Observable<any> = this.itemListSubject.asObservable();

    constructor() { }

    public addItemToCart(item: number) {
        // const currentItems = this.itemListSubject.getValue();
        // const updatedItems = [...currentItems, item];
        this.itemListSubject.next(item);
    }
}
