import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { User } from '@fusers/core/api-types';
import { UsersStore } from '@fusers/users/data-access';

import { MatIconModule } from '@angular/material/icon';

import { UsersListComponent } from './users-list/users-list.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

import { UserEditFormComponent } from './user-edit/user-edit-form.component';
import { EVENT_TYPES, EventBusService } from '@fusers/core/event-bus';

@Component({
  selector: 'fusers-users',
  standalone: true,
  imports: [UsersListComponent, UserOrdersComponent, UserEditFormComponent, MatIconModule],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  
  private readonly store = inject(UsersStore);
  private readonly eventBus = inject(EventBusService);
  
  private readonly destroy$ = new Subject<void>();

  readonly users = this.store.userEntities;
  readonly isLoading = this.store.loadUsersLoading;
  readonly selectedUserId = this.store.selectedUserId;

  readonly addModalShown = signal(false);

  readonly selectedUser = computed(() => this.store.userEntities().find(user => user.id === this.selectedUserId()));
  

  ngOnInit(): void {
    this.store.loadUsers();
    this.eventBus.getEventStream(EVENT_TYPES.ADD_MODAL_CLICK)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.addModalShown.set(!this.addModalShown());
      })
  }

  onUserSelect(userId: string): void {
    this.store.selectUser(userId);
  }

  onSaveUser(user: User): void {
    if (user.id) {
      this.store.updateUser(user);
    } else {
      this.store.addUser(user);
    }
  }

  onDeleteUser(user: User): void {
    this.store.removeUser(user.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}