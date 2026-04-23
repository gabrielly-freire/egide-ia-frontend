import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Department } from '../../models/department.model';
import { User } from '../../models/usuario.model';
import { DepartmentService } from '../../services/department/department';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly showForm = signal(false);
  readonly editingUserId = signal<number | null>(null);
  readonly departments = signal<Department[]>([]);
  readonly loadingDepartments = signal(false);

  readonly pageSize = 10;
  readonly roleOptions: Array<{ value: User['role']; label: string }> = [
    { value: 'REMONSTRANT', label: 'Reclamante' },
    { value: 'LISTENER', label: 'Ouvidor' },
    { value: 'MANAGER', label: 'Gestor' },
    { value: 'ADMIN', label: 'Administrador' }
  ];

  readonly userForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService
  ) {
    this.userForm = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      role: ['REMONSTRANT' as User['role'], [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      departmentId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUsers();
  }

  loadDepartments(): void {
    this.loadingDepartments.set(true);
    this.departmentService
      .listAll()
      .pipe(finalize(() => this.loadingDepartments.set(false)))
      .subscribe({
        next: departments => {
          this.departments.set(departments);
        },
        error: err => {
          this.error.set(this.formatError(err));
        }
      });
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService
      .listPaged(this.page(), this.pageSize)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => {
          this.users.set(response.content);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
        },
        error: err => {
          this.error.set(this.formatError(err));
        }
      });
  }

  openCreateForm(): void {
    this.editingUserId.set(null);
    this.showForm.set(true);
    this.success.set(null);
    this.userForm.reset({
      name: '',
      email: '',
      username: '',
      role: 'REMONSTRANT',
      password: '',
      departmentId: 0
    });
    if (this.departments().length === 0) {
      this.loadDepartments();
    }
  }

  openEditForm(user: User): void {
    this.editingUserId.set(user.id ?? null);
    this.showForm.set(true);
    this.success.set(null);
    this.userForm.reset({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      password: '',
      departmentId: user.departmentId ?? 0
    });
    if (this.departments().length === 0) {
      this.loadDepartments();
    }
  }

  closeForm(): void {
    this.showForm.set(false);
    this.userForm.reset({
      name: '',
      email: '',
      username: '',
      role: 'REMONSTRANT',
      password: '',
      departmentId: 0
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = this.userForm.getRawValue();
    const payload: User = {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      username: formValue.username.trim(),
      role: formValue.role,
      password: formValue.password.trim(),
      departmentId: Number(formValue.departmentId)
    };

    const id = this.editingUserId();
    const request$ = id
      ? this.userService.update(id, payload)
      : this.userService.create(payload);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.success.set(id ? 'Usuário atualizado com sucesso.' : 'Usuário criado com sucesso.');
          this.closeForm();
          this.loadUsers();
        },
        error: err => {
          this.error.set(this.formatError(err));
        }
      });
  }

  deleteUser(user: User): void {
    if (!user.id) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente remover o usuário ${user.name}?`
    );
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService
      .delete(user.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.success.set('Usuário removido com sucesso.');
          if (this.users().length === 1 && this.page() > 0) {
            this.page.update(value => value - 1);
          }
          this.loadUsers();
        },
        error: err => {
          this.error.set(this.formatError(err));
        }
      });
  }

  previousPage(): void {
    if (this.page() === 0 || this.loading()) {
      return;
    }

    this.page.update(value => value - 1);
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page() + 1 >= this.totalPages() || this.loading()) {
      return;
    }

    this.page.update(value => value + 1);
    this.loadUsers();
  }

  roleLabel(role: User['role']): string {
    return this.roleOptions.find(option => option.value === role)?.label ?? role;
  }

  departmentName(departmentId: number): string {
    return (
      this.departments().find(department => department.id === departmentId)?.name ??
      `ID ${departmentId}`
    );
  }

  private formatError(error: unknown): string {
    const message = (error as any)?.message;
    if (typeof message === 'string') {
      return message;
    }
    return 'Nao foi possivel concluir a operacao de usuarios.';
  }
}
