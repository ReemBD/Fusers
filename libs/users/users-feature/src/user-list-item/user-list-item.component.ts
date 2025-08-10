import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@fusers/core/api-types';

@Component({
  selector: 'fusers-user-list-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent {
  user = input.required<User>();
  isSelected = input<boolean>(false);
  
  userSelect = output<string>();
  editUser = output<User>();
  deleteUser = output<User>();

  onUserSelect(): void {
    this.userSelect.emit(this.user().id);
  }

  onEditUser(event: Event): void {
    event.stopPropagation();
    this.editUser.emit(this.user());
  }

  onDeleteUser(event: Event): void {
    event.stopPropagation();
    this.deleteUser.emit(this.user());
  }
}
