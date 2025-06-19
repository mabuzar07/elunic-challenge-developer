import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UserMessage } from '../../../../shared/interfaces/user-message.interface';

@Component({
  selector: 'app-user-message-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './user-message-card.component.html',
  styleUrls: ['./user-message-card.component.scss'],
})
export class UserMessageCardComponent {
  @Input() message!: UserMessage;
  @Input() showActions = true;
  @Output() deleteMessage = new EventEmitter<number>();

  constructor(private confirmationService: ConfirmationService) {}

  onDelete(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this message?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMessage.emit(this.message.id);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
