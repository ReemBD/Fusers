import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User, Order } from '@fusers/core/api-types';
import { UsersStore } from '@fusers/users/data-access';

@Component({
  selector: 'fusers-user-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent {
  protected readonly store = inject(UsersStore);

  // Computed properties based on store state
  protected readonly selectedUser = computed(() => this.store.selectedUser());
  protected readonly userOrders = computed(() => {
    const user = this.selectedUser();
    if (!user) return [];
    return this.store.getUserOrders(user.id);
  });

  protected readonly totalSpent = computed(() => {
    return this.userOrders().reduce((total, order) => total + (order?.amount || 0), 0);
  });

  protected getStatusClasses(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
