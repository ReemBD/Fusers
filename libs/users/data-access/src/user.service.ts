import { inject, Injectable } from '@angular/core';

import { User } from '@fusers/core/api-types';
import { ApiService } from '@fusers/core/http-client';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    readonly #apiService = inject(ApiService);

    getUsers() {
        return this.#apiService.get<User[]>('/users');
    }

    getUserById(id: string) {
        return this.#apiService.get<User>(`/users/${id}`);
    }

    createUser(user: Omit<User, 'id'>) {
        return this.#apiService.post<User, Omit<User, 'id'>>('/users', user);
    }

    updateUser(id: string, user: User) {
        return this.#apiService.put<User, User>(`/users/${id}`, user);
    }

    deleteUser(id: string) {
        return this.#apiService.delete<boolean>(`/users/${id}`);
    }
}