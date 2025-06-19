import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { UserMessageCardComponent } from '../user-message-card/user-message-card.component';
import { 
  UserMessage, 
  PaginatedUserMessagesResponse, 
  UserMessageQueryParams 
} from '../../../../shared/interfaces/user-message.interface';

interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-message-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    DropdownModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    UserMessageCardComponent
  ],
  templateUrl: './user-message-list.component.html',
  styleUrls: ['./user-message-list.component.scss']
})
export class UserMessageListComponent {
  @Input() messagesData: PaginatedUserMessagesResponse | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() pageChange = new EventEmitter<UserMessageQueryParams>();
  @Output() sortChange = new EventEmitter<UserMessageQueryParams>();
  @Output() deleteMessage = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  sortOptions: SortOption[] = [
    { label: 'Newest First', value: 'createdAt_DESC' },
    { label: 'Oldest First', value: 'createdAt_ASC' },
    { label: 'Name A-Z', value: 'name_ASC' },
    { label: 'Name Z-A', value: 'name_DESC' },
    { label: 'Email A-Z', value: 'email_ASC' },
    { label: 'Email Z-A', value: 'email_DESC' }
  ];

  selectedSort = 'createdAt_DESC';

  // Fix: Add the missing trackByMessageId function
  trackByMessageId(index: number, message: UserMessage): number {
    return message.id;
  }

  onPageChange(event: any): void {
    const params: UserMessageQueryParams = {
      page: event.page + 1, // PrimeNG paginator is 0-based
      limit: event.rows
    };
    this.pageChange.emit(params);
  }

  onSortChange(): void {
    const [sortBy, sortOrder] = this.selectedSort.split('_') as [
      'createdAt' | 'name' | 'email',
      'ASC' | 'DESC'
    ];
    
    const params: UserMessageQueryParams = {
      sortBy,
      sortOrder
    };
    this.sortChange.emit(params);
  }

  onDeleteMessage(messageId: number): void {
    this.deleteMessage.emit(messageId);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  get totalRecords(): number {
    return this.messagesData?.pagination.totalItems || 0;
  }

  get currentPage(): number {
    return this.messagesData ? this.messagesData.pagination.currentPage - 1 : 0; // Convert to 0-based
  }

  get rowsPerPage(): number {
    return this.messagesData?.pagination.itemsPerPage || 3;
  }
}