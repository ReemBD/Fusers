import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { User } from '@fusers/core/api-types';

import { UserListItemComponent } from '../user-list-item/user-list-item.component';

@Component({
  selector: 'fusers-users-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {
  readonly users = input<User[]>([]);
  readonly selectedUserId = input<string | null>(null);
  
  readonly userSelect = output<string>();
  readonly deleteUser = output<User>();
}
