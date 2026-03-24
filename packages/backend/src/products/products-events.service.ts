import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface ProductEvent {
  type: 'created' | 'updated' | 'deleted';
  productId: string;
  timestamp: string;
}

@Injectable()
export class ProductsEventService {
  private subject = new Subject<ProductEvent>();

  emit(event: ProductEvent) {
    this.subject.next(event);
  }

  getEvents(): Observable<ProductEvent> {
    return this.subject.asObservable();
  }
}
