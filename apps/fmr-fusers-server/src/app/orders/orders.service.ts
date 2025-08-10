import { Injectable } from '@nestjs/common';

import { Order } from '@fusers/core/api-types';

const orders: Order[] = [
  {
    id: '1',
    userId: '1',
    amount: 299.99,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    amount: 149.50,
    status: 'pending',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    userId: '3',
    amount: 599.99,
    status: 'completed',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    userId: '4',
    amount: 89.99,
    status: 'cancelled',
    createdAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    userId: '5',
    amount: 199.99,
    status: 'completed',
    createdAt: '2024-01-19T11:30:00Z'
  },
  {
    id: '6',
    userId: '6',
    amount: 349.99,
    status: 'pending',
    createdAt: '2024-01-20T13:20:00Z'
  },
  {
    id: '7',
    userId: '7',
    amount: 129.99,
    status: 'completed',
    createdAt: '2024-01-21T08:45:00Z'
  },
  {
    id: '8',
    userId: '8',
    amount: 499.99,
    status: 'processing',
    createdAt: '2024-01-22T15:10:00Z'
  },
  {
    id: '9',
    userId: '9',
    amount: 79.99,
    status: 'completed',
    createdAt: '2024-01-23T12:30:00Z'
  },
  {
    id: '10',
    userId: '10',
    amount: 259.99,
    status: 'pending',
    createdAt: '2024-01-24T10:15:00Z'
  },
];

@Injectable()
export class OrdersService {
  getOrders() {
    return orders;
  }

  getOrderById(id: string) {
    return orders.find(order => order.id === id);
  }

  createOrder(orderData: { userId: string; amount: number; status?: string }) {
    const newOrder = {
      id: (orders.length + 1).toString(),
      userId: orderData.userId,
      amount: orderData.amount,
      status: orderData.status || 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id: string, orderData: { userId?: string; amount?: number; status?: string }) {
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return null;
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...orderData
    };
    
    return orders[orderIndex];
  }

  deleteOrder(id: string) {
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return false;
    }
    
    orders.splice(orderIndex, 1);
    return true;
  }
}
