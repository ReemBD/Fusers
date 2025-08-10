import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { User } from '@fusers/core/api-types';

@Component({
  selector: 'fusers-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent {
  readonly user = input.required<User>();
}