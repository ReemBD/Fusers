import { Injectable } from '@nestjs/common';

const users = [
    
]
@Injectable()
export class UsersService {
  getUsers() {
    return 'Users';
  }
}