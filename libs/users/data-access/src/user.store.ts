import { patchState, signalStore, withMethods, withState, withComputed } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

import { Order, User } from "@fusers/core/api-types";
import { setLoaded, setLoading, withCallState } from "@fusers/core/data-access";

import { inject } from "@angular/core";
import { UserService } from "./user.service";
import { delay, pipe, switchMap, catchError, of, map, combineLatest, tap } from "rxjs";
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
        userEntities: () => state.users.entities(),
        selectedUser: () => {
            const selectedId = state.selectedUserId();
            const entities = state.users.entities();
            return selectedId ? entities[selectedId] || null : null;
        },
        orderEntities: () => state.orders.entities(),
    })),
    withMethods((store, userService = inject(UserService), ordersService = inject(OrdersService)) => ({
        loadUsers: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { ...setLoading('loadUsers') as any });
                    return combineLatest([userService.getUsers(), ordersService.getOrders()]).pipe(
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
                    const newUser = { ...userData, id: Date.now().toString() };
                    patchState(store, {
                        users: userAdapter.addOne(newUser, store.users())
                    });
                    return userService.createUser(newUser).pipe(
                        delay(1000),
                        tapResponse({
                            next: (createdUser) => {
                                patchState(store, {
                                    users: userAdapter.addOne(createdUser, store.users())
                                });
                            },
                            error: (error) => {
                                patchState(store, {
                                    users: userAdapter.removeOne(newUser.id, store.users())
                                });
                            }
                        })
                    );
                })
            )
        ),

        updateUser: rxMethod<User>(
            pipe(
                switchMap((user) => {
                    patchState(store, {
                        users: userAdapter.updateOne(
                            { id: user.id, changes: user },
                            store.users()
                        )
                    });
                    return userService.updateUser(user.id, user).pipe(
                        tapResponse({
                            next: (updatedUser) => {
                                patchState(store, {
                                    users: userAdapter.updateOne(
                                        { id: user.id, changes: updatedUser },
                                        store.users()
                                    )
                                });
                            },
                            error: (error) => {
                                patchState(store, {
                                    users: userAdapter.updateOne(
                                        { id: user.id, changes: user },
                                        store.users()
                                    )
                                });
                            }
                        })
                    );
                })
            )
        ),

        removeUser: rxMethod<string>(
            pipe(
                switchMap((userId) => {
                    const user = store.userEntities()[userId];
                    if (!user) return of(false);

                    const userToRestore = { ...user };
                    patchState(store, {
                        users: userAdapter.removeOne(userId, store.users())
                    });

                    return userService.deleteUser(userId).pipe(
                        tapResponse({
                            next: () => {
                                patchState(store, {
                                    users: userAdapter.removeOne(userId, store.users())
                                });
                            },
                            error: (error) => {
                                patchState(store, {
                                    users: userAdapter.addOne(userToRestore, store.users())
                                });
                            }
                        })
                    );
                })
            )
        ),

        selectUser: (userId: string | null) => {
            patchState(store, { selectedUserId: userId });
        },

        getUserOrders: (userId: string) => {
            let orders = [];
            for (const orderId in store.orderEntities()) {
                if (store.orderEntities()[orderId]?.userId === userId) {
                    orders.push(store.orderEntities()[orderId]);
                }
            }
            return orders;
        }
    })),
    withCallState({ collection: 'loadUsers' }),
);
