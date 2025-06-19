export interface UserMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserMessageDto {
  name: string;
  email: string;
  message: string;
}

export interface PaginatedUserMessagesResponse {
  data: UserMessage[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface UserMessageQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'email';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
