import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { UsersListComponent } from './users-list/users-list.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

import { User } from '@fusers/core/api-types';
import { UsersStore } from '@fusers/users/data-access';

@Component({
  selector: 'fusers-users',
  standalone: true,
  imports: [UsersListComponent, UserOrdersComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly store = inject(UsersStore);

  readonly users = this.store.userEntities;
  readonly isLoading = this.store.loadUsersLoading;
  readonly selectedUserId = this.store.selectedUserId;

  ngOnInit(): void {
    this.store.loadUsers();
  }

  onUserSelect(userId: string): void {
    this.store.selectUser(userId);
  }

  onEditUser(user: User): void {
    this.store.updateUser(user);
  }

  onDeleteUser(user: User): void {
    this.store.removeUser(user.id);
  }
}