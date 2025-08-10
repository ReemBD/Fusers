import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('@fusers/users/users').then(m => m.UsersComponent),
    }
];
