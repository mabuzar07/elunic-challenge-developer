import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserMessageFormComponent } from '../../components/user-message-form/user-message-form.component';
import { UserMessageListComponent } from '../../components/user-message-list/user-message-list.component';
import { UserMessageService } from '../../../../shared/services/user-message.service';
import {
  UserMessage,
  PaginatedUserMessagesResponse,
  UserMessageQueryParams,
} from '../../../../shared/interfaces/user-message.interface';

@Component({
  selector: 'app-user-messages-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    UserMessageFormComponent,
    UserMessageListComponent,
  ],
  providers: [MessageService],
  templateUrl: './user-messages-page.component.html',
  styleUrls: ['./user-messages-page.component.scss'],
})
export class UserMessagesPageComponent implements OnInit, OnDestroy {
  messagesData: PaginatedUserMessagesResponse | null = null;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private currentParams: UserMessageQueryParams = {
    page: 1,
    limit: 3,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  };

  constructor(
    private userMessageService: UserMessageService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMessages(params: UserMessageQueryParams = this.currentParams): void {
    this.loading = true;
    this.error = null;
    this.currentParams = { ...this.currentParams, ...params };

    this.userMessageService
      .getMessages(this.currentParams)
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: (response: any) => {
          this.messagesData = response;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = error.message || 'Failed to load messages';
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.error || undefined,
            life: 5000,
          });
        },
      });
  }

  onMessageCreated(message: UserMessage): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message sent successfully!',
      life: 3000,
    });

    // Reload messages to show the new one
    this.loadMessages({ page: 1 });
  }

  onPageChange(params: UserMessageQueryParams): void {
    this.loadMessages(params);
  }

  onSortChange(params: UserMessageQueryParams): void {
    this.loadMessages({ ...params, page: 1 }); // Reset to first page when sorting
  }

  onDeleteMessage(messageId: number): void {
    this.userMessageService
      .deleteMessage(messageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Message deleted successfully',
            life: 3000,
          });

          // Reload current page
          this.loadMessages();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete message',
            life: 5000,
          });
        },
      });
  }

  onRefresh(): void {
    this.loadMessages();
  }
}
