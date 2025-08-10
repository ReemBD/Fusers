import { patchState, signalStore, withMethods, withState, withComputed } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

import { Order, User } from "@fusers/core/api-types";
import { setLoaded, setLoading, withCallState } from "@fusers/core/data-access";

import { inject } from "@angular/core";
import { UserService } from "./user.service";
import { delay, pipe, switchMap, combineLatest, tap } from "rxjs";
import { OrdersService } from "./order.service";
import { tapResponse } from "@ngrx/operators";

// Entity adapter for users
const userAdapter = createEntityAdapter<User>({
    selectId: (user: User) => user.id,
    sortComparer: (a: User, b: User) => a.name.localeCompare(b.name),
});

// Entity adapter for orders
const orderAdapter = createEntityAdapter<Order>({
    selectId: (order: Order) => order.id,
    sortComparer: (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

interface UserStoreState {
    users: EntityState<User>;
    orders: EntityState<Order>;
    selectedUserId: string | null;
}

const initialState: UserStoreState = {
    users: userAdapter.getInitialState(),
    orders: orderAdapter.getInitialState(),
    selectedUserId: null,
};

export const UsersStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((state) => ({
        userEntities: () => state.users.ids().map(id => state.users.entities()[id]) as User[],
        selectedUser: () => {
            const selectedId = state.selectedUserId();
            const entities = state.users.entities();
            return selectedId ? entities[selectedId] || null : null;
        },
        orderEntities: () => state.orders.ids().map(id => state.orders.entities()[id]) as Order[],
    })),
    withMethods((store, userService = inject(UserService), ordersService = inject(OrdersService)) => ({
        loadUsers: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { ...setLoading('loadUsers') as any });
                    return combineLatest([userService.getUsers(), ordersService.getOrders()]).pipe(
                        // Mock loading time
                        delay(1000),
                        tapResponse({
                            next: ([users, orders]) => {
                                patchState(store, {
                                    users: userAdapter.setAll(users, store.users()),
                                    orders: orderAdapter.setAll(orders, store.orders()),
                                    ...setLoaded('loadUsers')
                                });
                            },
                            error: (error) => {
                                patchState(store, {
                                    users: userAdapter.getInitialState(),
                                    orders: orderAdapter.getInitialState(),
                                    ...setLoaded('loadUsers')
                                });
                            }
                        })
                    );
                })
            )
        ),

        addUser: rxMethod<Omit<User, 'id'>>(
            pipe(
                switchMap((userData) => {
                    return userService.createUser(userData).pipe(
                        tap((createdUser) => {
                            patchState(store, {
                                users: userAdapter.addOne(createdUser, store.users())
                            });
                        }),
                    );
                })
            )
        ),

        updateUser: rxMethod<User>(
            pipe(
                switchMap((user) => {
                    return userService.updateUser(user.id, user).pipe(
                        tap((updatedUser) => {
                            patchState(store, {
                                users: userAdapter.updateOne(
                                    { id: user.id, changes: updatedUser },
                                    store.users()
                                )
                            });
                        }),
                    );
                })
            )
        ),
        removeUser: rxMethod<string>(
            pipe(
                switchMap((userId) => {
                    return userService.deleteUser(userId).pipe(
                        tap(() => {
                            patchState(store, {
                                users: userAdapter.removeOne(userId, store.users())
                            });
                        }),
                    );
                })
            )
        ),
        selectUser: (userId: string | null) => {
            patchState(store, { selectedUserId: userId });
        },

        getUserOrders: (userId: string) => {
            const orders: Order[] = [];
            for (const orderId in store.orderEntities()) {
                const order = store.orderEntities()[orderId] as Order;
                if (order.userId === userId) {
                    orders.push(order);
                }
            }
            return orders;
        }
    })),
    withCallState({ collection: 'loadUsers' }),
);
