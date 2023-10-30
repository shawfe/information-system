import { Component, OnInit } from '@angular/core';
import { EmailConfirmationService } from './email-confirmation.service';

@Component({
  selector: 'email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  constructor(private _emailConfirmationService: EmailConfirmationService) {}

  ngOnInit() {
    this._emailConfirmationService.confirmEmail();
  }

  public onNavigateToSignIn(): void {
    this._emailConfirmationService.navigateToSignIn();
  }
}
