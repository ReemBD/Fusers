import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';

import { User } from '@fusers/core/api-types';
import { UsersStore } from '@fusers/users/data-access';

import { UsersListComponent } from './users-list/users-list.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

import { UserEditFormComponent } from './user-edit/user-edit-form.component';

@Component({
  selector: 'fusers-users',
  standalone: true,
  imports: [UsersListComponent, UserOrdersComponent, UserEditFormComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly store = inject(UsersStore);

  readonly users = this.store.userEntities;
  readonly isLoading = this.store.loadUsersLoading;
  readonly selectedUserId = this.store.selectedUserId;

  readonly selectedUser = computed(() => this.store.userEntities().find(user => user.id === this.selectedUserId()));
  
  readonly showAdd = signal(false);
  
  ngOnInit(): void {
    this.store.loadUsers();
  }

  onUserSelect(userId: string): void {
    this.store.selectUser(userId);
  }

  onEditUser(user: User): void {
    if (user.id) {
      this.store.updateUser(user);
    } else {
      this.store.addUser(user);
    }
  }

  onDeleteUser(user: User): void {
    this.store.removeUser(user.id);
  }
}