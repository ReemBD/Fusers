import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { User } from '@fusers/core/api-types';

import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'fusers-user-list-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent {
  user = input.required<User>();
  isSelected = input<boolean>(false);
  
  userSelect = output<string>();
  deleteUser = output<User>();
}
