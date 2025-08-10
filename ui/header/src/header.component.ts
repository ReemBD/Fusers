import { Component, inject, input, output } from '@angular/core';

import { EVENT_TYPES, EventBusService } from '@fusers/core/event-bus';

@Component({
    selector: 'fusers-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    readonly eventBus = inject(EventBusService, { optional: true });

    readonly hideShowAdd = input<boolean>();

    readonly showAdd = output();

    onAddClick() {
        this.showAdd.emit();
        this.eventBus?.publish(EVENT_TYPES.ADD_MODAL_CLICK);
    }
}