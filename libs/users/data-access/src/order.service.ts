import { inject, Injectable } from '@angular/core';

import { Order } from '@fusers/core/api-types';
import { ApiService } from '@fusers/core/http-client';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    readonly #apiService = inject(ApiService);

    getOrders() {
        return this.#apiService.get<Order[]>('/orders');
    }

    getOrderById(id: string) {
        return this.#apiService.get<Order>(`/orders/${id}`);
    }

    createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
        return this.#apiService.post<Order, Omit<Order, 'id' | 'createdAt'>>('/orders', order);
    }

    updateOrder(id: string, order: Partial<Order>) {
        return this.#apiService.put<Order, Partial<Order>>(`/orders/${id}`, order);
    }

    deleteOrder(id: string) {
        return this.#apiService.delete<boolean>(`/orders/${id}`);
    }
}
