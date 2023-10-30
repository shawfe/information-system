import { Component, Input } from '@angular/core';

@Component({
  selector: 'auth-base',
  templateUrl: './auth-base.component.html',
  styleUrls: ['./auth-base.component.scss']
})
export class AuthBaseComponent {
  @Input() customClass: string = '';

  public getCustomClass() {
    return { [`${this.customClass}`]: this.customClass };
  }
}
