import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export abstract class BaseService<T> {

  constructor(
    protected http: HttpClient,
    protected url: string
  ) {}

  protected handleError(error: any) {
    console.error(`Erro na requisição para ${this.url}:`, error);
    return throwError(() => error.error?.message || 'Erro interno no servidor');
  }

  list(page: number = 0, size: number = 10): Observable<T[]> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get<any>(this.url, { params }).pipe(
    map(res => {
      if (Array.isArray(res)) {
        return res;
      }
      return res.content || [];
    }),
    catchError(err => this.handleError(err))
  );
}

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.url, item).pipe(
      catchError(err => this.handleError(err))
    );
  }

  update(id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, item).pipe(
      catchError(err => this.handleError(err))
    );
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
