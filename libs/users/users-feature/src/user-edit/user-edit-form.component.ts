import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { User } from '@fusers/core/api-types';

@Component({
    selector: 'fusers-user-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.css']
})
export class UserEditFormComponent {
    private readonly fb = inject(FormBuilder).nonNullable;
    
    readonly user = input<User>();
    readonly save = output<User>();

    readonly form = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        phone: [''],
    });

    constructor() {
        effect(() => {
            this.form.patchValue(this.user() as any);
        });
    }

    onSubmit() {
        const newUser = { ...this.user(), ... this.form.value } as User
        this.save.emit(newUser);
    }
}