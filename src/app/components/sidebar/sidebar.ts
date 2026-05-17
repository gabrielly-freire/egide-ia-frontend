import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly currentRole = computed(
    () => this.authService.currentUser()?.role?.toUpperCase() ?? null
  );

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  hasAnyRole(roles: ReadonlyArray<string>): boolean {
    const role = this.currentRole();
    if (!role) return false;
    return roles.map(r => r.toUpperCase()).includes(role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
