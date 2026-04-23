import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { BaseService } from '../base/base';
import { User } from '../../models/usuario.model';

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {

  constructor(http: HttpClient) {
    super(http, '/api/v1/user-info');
  }

  listPaged(page: number = 0, size: number = 10): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<User>>(this.url, { params }).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
