import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IGenerateLinkData } from 'app/models/generate-link.data';
import { TimeUnits, TimeUnitsType } from 'app/models/time-units.data';
import { GenerateLinkService } from 'app/services/sign-up-link-requests.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sign-up-link',
  templateUrl: 'sign-up-link.component.html',
  styleUrls: ['./sign-up-link.component.scss']
})
export class SignUpLinkComponent implements OnInit {
  public generateLinkForm: FormGroup;
  public timeUnits = TimeUnits;
  public durationRange$ = new BehaviorSubject<string[]>([]);

  public isShowLabel$: BehaviorSubject<boolean>;

  private _currentCopiedLink: string = '';

  get linkControl(): FormControl {
    return this.generateLinkForm.get('linkControl') as FormControl;
  }

  get durationControl(): FormControl {
    return this.generateLinkForm.get('durationControl') as FormControl;
  }

  get timeUnitsControl(): FormControl {
    return this.generateLinkForm.get('timeUnitsControl') as FormControl;
  }

  constructor(
    private _generateLinkService: GenerateLinkService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isShowLabel$ = new BehaviorSubject<boolean>(true);
    this.generateLinkForm = this._formBuilder.group({
      linkControl: this._formBuilder.control({ value: '', disabled: true }),
      durationControl: this._formBuilder.control(''),
      timeUnitsControl: this._formBuilder.control('HOURS')
    });
    this._defineDurationRange('HOURS');
  }

  public onTimeUnitsChange(timeUnits: TimeUnitsType): void {
    this._defineDurationRange(timeUnits);
  }

  public onLinkClick(): void {
    this._currentCopiedLink = this.linkControl.value;
    navigator.clipboard.writeText(this._currentCopiedLink).then(() => {});
  }

  public onGenerateLink() {
    const data: IGenerateLinkData = {
      duration: this.durationControl.value,
      timeUnits: this.timeUnitsControl.value,
      link: `${window.location.origin}/auth/sign-up`
    };
    this._generateLinkService.requestGenerateLink(data).subscribe((link) => {
      this.isShowLabel$.next(false);
      this.linkControl.setValue(link);
    });
  }

  private _defineDurationRange(timeUnits: TimeUnitsType): void {
    const rangeData: string[] = [];
    let range: number;

    switch (timeUnits) {
      case 'MINUTES': {
        range = 60;
        break;
      }
      case 'HOURS': {
        range = 24;
        break;
      }
      case 'DAYS': {
        range = 3;
        break;
      }
      default: {
        break;
      }
    }

    for (let i = 1, j = range; i < j; i++) {
      rangeData.push(i.toString());
    }

    this.durationRange$.next(rangeData);
    this.durationControl.setValue(rangeData.length ? rangeData[0] : '');
  }
}
