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
  users = input<User[]>([]);
  selectedUserId = input<string | null>(null);
  
  userSelect = output<string>();
  editUser = output<User>();
  deleteUser = output<User>();

  onUserSelect(userId: string): void {
    this.userSelect.emit(userId);
  }

  onEditUser(user: User): void {
    this.editUser.emit(user);
  }

  onDeleteUser(user: User): void {
    this.deleteUser.emit(user);
  }
}
