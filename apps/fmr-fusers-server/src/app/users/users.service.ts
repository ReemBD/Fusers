import { Injectable } from '@nestjs/common';

import { User } from '@fmr-fusers/core/api-types';

const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@example.com'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com'
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@example.com'
  },
  {
    id: '9',
    name: 'Christopher Garcia',
    email: 'christopher.garcia@example.com'
  },
  {
    id: '10',
    name: 'Amanda Rodriguez',
    email: 'amanda.rodriguez@example.com'
  },
  {
    id: '11',
    name: 'James Lopez',
    email: 'james.lopez@example.com'
  },
  {
    id: '12',
    name: 'Michelle Gonzalez',
    email: 'michelle.gonzalez@example.com'
  },
  {
    id: '13',
    name: 'Daniel Perez',
    email: 'daniel.perez@example.com'
  },
  {
    id: '14',
    name: 'Jessica Torres',
    email: 'jessica.torres@example.com'
  },
  {
    id: '15',
    name: 'Matthew Flores',
    email: 'matthew.flores@example.com'
  },
  {
    id: '16',
    name: 'Nicole Rivera',
    email: 'nicole.rivera@example.com'
  },
  {
    id: '17',
    name: 'Andrew Collins',
    email: 'andrew.collins@example.com'
  },
  {
    id: '18',
    name: 'Stephanie Stewart',
    email: 'stephanie.stewart@example.com'
  },
  {
    id: '19',
    name: 'Kevin Morris',
    email: 'kevin.morris@example.com'
  },
  {
    id: '20',
    name: 'Rachel Cooper',
    email: 'rachel.cooper@example.com'
  }
];

@Injectable()
export class UsersService {
  getUsers() {
    return users;
  }

  getUserById(id: string) {
    return users.find(user => user.id === id);
  }

  createUser(userData: { name: string; email: string }) {
    const newUser = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email
    };
    users.push(newUser);
    return newUser;
  }

  updateUser(id: string, userData: { name?: string; email?: string }) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...userData
    };
    
    return users[userIndex];
  }

  deleteUser(id: string) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    
    users.splice(userIndex, 1);
    return true;
  }
}