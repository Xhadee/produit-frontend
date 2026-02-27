import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styles: [`
    .footer {
      background-color: #ffffff;
      color: #64748b;
    }
    .text-primary { color: #2563eb !important; }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
