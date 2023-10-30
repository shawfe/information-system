import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'switch-language',
  templateUrl: './switch-language.component.html',
  styleUrls: ['./switch-language.component.scss']
})
export class SwitchLanguageComponent implements OnInit {
  public languageControl = new FormControl();
  public supportedLanguages: string[] = [];

  constructor(private _translateService: TranslateService) {}

  ngOnInit(): void {
    this.supportedLanguages = this._translateService.getLangs();
  }

  public onLanguageChange(language: string): void {
    this._translateService.use(language);
  }
}
