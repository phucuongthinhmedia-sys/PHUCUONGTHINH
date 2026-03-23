import { Observable } from 'rxjs';
export interface ProductEvent {
    type: 'created' | 'updated' | 'deleted';
    productId: string;
    timestamp: string;
}
export declare class ProductsEventService {
    private subject;
    emit(event: ProductEvent): void;
    getEvents(): Observable<ProductEvent>;
}
