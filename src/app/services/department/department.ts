import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Department } from '../../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly url = '/api/v1/departments';

  constructor(private readonly http: HttpClient) {}

  listAll(): Observable<Department[]> {
    return this.http.get<any>(this.url).pipe(
      map(response => {
        const rawList = Array.isArray(response) ? response : (response?.content ?? []);
        return rawList.map((item: any) => ({
          id: Number(item.id),
          name: String(item.name ?? item.nome ?? item.description ?? `Departamento ${item.id}`)
        }));
      }),
      catchError(error => {
        const message = error?.error?.message ?? 'Erro ao carregar departamentos.';
        return throwError(() => new Error(message));
      })
    );
  }
}
