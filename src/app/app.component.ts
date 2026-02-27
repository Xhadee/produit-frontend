import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { ThemeService } from './services/theme.service';
import {SidebarComponent} from "./components/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    WelcomeScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private themeService = inject(ThemeService);

  isCollapsed = false;
  isDarkMode = this.themeService.isDarkMode;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
