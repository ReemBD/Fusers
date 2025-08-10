import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { UserService, UsersStore } from '@fusers/users/data-access';


@Component({
  selector: 'fusers-user-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent {
  private readonly store = inject(UsersStore);
  private readonly userService = inject(UserService);

  readonly selectedUserId = this.store.selectedUserId;
  // No. 6 in pdf solution.
  // this works because switchMap automatically cancels the previous subscription when a new value is emitted.
  readonly selectedUserId$ = toObservable(this.selectedUserId);
  readonly selectedUserDetails = toSignal(
    this.selectedUserId$.pipe(
      switchMap((id) => id ? this.userService.getUserById(id) : of(null))
    )
  );

  readonly vm = this.store.userOrdersVm;
}
