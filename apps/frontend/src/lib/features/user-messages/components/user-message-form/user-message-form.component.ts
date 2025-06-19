import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserMessageService } from '../../../../shared/services/user-message.service';
import {
  CreateUserMessageDto,
  UserMessage,
} from '../../../../shared/interfaces/user-message.interface';
import { CustomValidators } from '../../../../shared/validators/custom-validator';

@Component({
  selector: 'app-user-message-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    ButtonModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './user-message-form.component.html',
  styleUrls: ['./user-message-form.component.scss'],
})
export class UserMessageFormComponent {
  @Output() messageCreated = new EventEmitter<UserMessage>();

  messageForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private userMessageService: UserMessageService
  ) {
    this.messageForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          CustomValidators.noWhitespace(),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5000),
          CustomValidators.noWhitespace(),
          CustomValidators.maxWords(500),
        ],
      ],
    });
  }

  get nameControl() {
    return this.messageForm.get('name');
  }
  get emailControl() {
    return this.messageForm.get('email');
  }
  get messageControl() {
    return this.messageForm.get('message');
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      const formData: CreateUserMessageDto = this.messageForm.value;

      this.userMessageService.createMessage(formData).subscribe({
        next: (createdMessage) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.messageForm.reset();
          this.messageCreated.emit(createdMessage);

          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError =
            error.message || 'Failed to submit message. Please try again.';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.messageForm.controls).forEach((key) => {
      const control = this.messageForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.messageForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          control.errors['minlength'].requiredLength
        } characters`;
      }
      if (control.errors['maxlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot exceed ${
          control.errors['maxlength'].requiredLength
        } characters`;
      }
      if (control.errors['whitespace']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot be only whitespace`;
      }
      if (control.errors['maxWords']) {
        return `Message cannot exceed ${control.errors['maxWords'].maxWords} words`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.messageForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
