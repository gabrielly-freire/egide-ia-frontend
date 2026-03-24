import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base';
import { User } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8081/v1/user-info');
  }
}
