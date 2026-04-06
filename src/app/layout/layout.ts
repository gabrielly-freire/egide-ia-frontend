import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  sidebarVisible = signal(true);
  headerVisible = signal(true);
  footerVisible = signal(true);

  toggleSidebar(): void {
    this.sidebarVisible.update(value => !value);
  }

  toggleHeader(): void {
    this.headerVisible.update(value => !value);
  }

  toggleFooter(): void {
    this.footerVisible.update(value => !value);
  }
}
