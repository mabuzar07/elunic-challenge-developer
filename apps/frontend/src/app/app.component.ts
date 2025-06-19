import { Component } from '@angular/core';
import { UserMessagesPageComponent } from '../lib/features/user-messages/pages/user-messages-page/user-messages-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserMessagesPageComponent],
  template: ` <app-user-messages-page></app-user-messages-page> `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
}
