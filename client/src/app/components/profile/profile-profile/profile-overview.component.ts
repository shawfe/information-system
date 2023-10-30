import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SectionType } from 'app/models/book.data';
import { IProgress, IProgressExerciseData, IProgressItem } from 'app/models/progress.data';
import { IUserData } from 'app/models/user.data';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {
  @ViewChild('variantPaginator') set progressPaginatorElement(paginator: MatPaginator) {
    this.progressDataSource.paginator = paginator;
  }

  public displayedColumns = ['date', 'section', 'name', 'points', 'mark'];
  public emailControl: FormControl;
  public currentUser: IUserData;
  public progressDataSource = new MatTableDataSource<IProgressItem>();
  public progressItems$: Observable<IProgressItem[]>;
  public progress$ = new BehaviorSubject<IProgress>(null);

  constructor(
    private _profileService: ProfileService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this._profileService.init();
    this.progressItems$ = this.progressDataSource.connect();
    this.currentUser = this._profileService.getCurrentUser();
    this.emailControl = new FormControl({
      value: this.currentUser.email,
      disabled: true
    });

    this._profileService.getProgressObservable().subscribe((progress) => {
      this.progress$.next(progress);
      this.progressDataSource.data = progress?.progressItems ? progress.progressItems : [];
    });
  }

  public getPointsLabel(progressItem: IProgressItem): string {
    if (progressItem.type === 'EXERCISE') {
      const fromLabel = this._translateService.instant('FROM');
      const exerciseData = progressItem.itemData as IProgressExerciseData;
      return `${exerciseData.earnedPoints} ${fromLabel} ${exerciseData.maxPoints}`;
    }

    return '-';
  }

  public getMarkLabel(progressItem: IProgressItem): string {
    if (progressItem.type === 'EXERCISE') {
      const exerciseData = progressItem.itemData as IProgressExerciseData;
      return `${exerciseData.mark}`;
    }

    return '-';
  }

  public getBarValue(sectionType: SectionType): number {
    if (!this.progress$.getValue()) {
      return 0;
    }

    const bar = this.progress$
      .getValue()
      .progressBars.find((bar) => bar.sectionType === sectionType);
    return bar.totalProgressItems !== 0
      ? Math.round(bar.finishedProgressItems / bar.totalProgressItems) * 100
      : 0;
  }
}
