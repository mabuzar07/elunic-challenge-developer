import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  UserMessage,
  CreateUserMessageDto,
  PaginatedUserMessagesResponse,
  UserMessageQueryParams,
  ApiError,
} from '../interfaces/user-message.interface';

@Injectable({
  providedIn: 'root',
})
export class UserMessageService {
  private readonly apiUrl = 'http://localhost:3000/api/user-messages';

  constructor(private http: HttpClient) {}

  createMessage(message: CreateUserMessageDto): Observable<UserMessage> {
    return this.http
      .post<UserMessage>(this.apiUrl, message)
      .pipe(retry(1), catchError(this.handleError));
  }

  getMessages(
    params: UserMessageQueryParams = {}
  ): Observable<PaginatedUserMessagesResponse> {
    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http
      .get<PaginatedUserMessagesResponse>(this.apiUrl, { params: httpParams })
      .pipe(retry(1), catchError(this.handleError));
  }

  getMessage(id: number): Observable<UserMessage> {
    return this.http
      .get<UserMessage>(`${this.apiUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteMessage(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      const apiError = error.error as ApiError;
      errorMessage =
        apiError?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('UserMessageService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
