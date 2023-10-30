import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sign-up-finished',
  templateUrl: './sign-up-finished.component.html',
  styleUrls: ['./sign-up-finished.component.scss']
})
export class SignUpFinishedComponent {
  constructor(private _router: Router) {}

  public navigateToSignIn(): void {
    this._router.navigate(['/auth/sign-in']);
  }
}
