import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SectionType } from 'app/models/book.data';
import { IGroupWithUsers } from 'app/models/group.data';
import { IProgress, IProgressExerciseData, IProgressItem } from 'app/models/progress.data';
import { UserShortData } from 'app/models/user.data';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../admin.service';
import { UserResultsService } from './user-results.service';

@Component({
  selector: 'users-registration',
  templateUrl: './user-results.component.html',
  styleUrls: ['./user-results.component.scss']
})
export class UserResultsComponent implements OnInit, OnDestroy {
  @ViewChildren('userGroupsPaginator') set matPaginators(paginators: QueryList<MatPaginator>) {
    if (!paginators || !paginators.length) {
      return;
    }
    let index = 0;
    for (const datasource of this.groupsDataSourceMap.values()) {
      datasource.paginator = paginators.toArray().at(index);
      index += index;
    }
    index = 0;
  }

  @ViewChild('userProgressPaginator') set matPaginator(paginator: MatPaginator) {
    this.progressDataSource.paginator = paginator;
  }

  public groupDisplayedColumns = ['firstName', 'lastName', 'lastActivity', 'details'];
  public resultDisplayedColumns = ['date', 'section', 'title', 'points', 'mark'];

  public groupsDataSourceMap = new Map<string, MatTableDataSource<UserShortData>>();
  public progressDataSource = new MatTableDataSource<IProgressItem>();
  public groupsWithUsers$: Observable<IGroupWithUsers[]>;
  public groupNamesMap = new Map<string, string>();
  public progressItems$: Observable<IProgressItem[]>;
  public progress$: Observable<IProgress>;
  public selectedUser$: Observable<UserShortData>;

  private _unsubscribe = new Subject<void>();

  constructor(
    private _userResultsService: UserResultsService,
    private _adminService: AdminService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.progressItems$ = this.progressDataSource.connect();
    this._adminService.loadGroupsWithUsers();
    this._userResultsService.init();
    this.groupsWithUsers$ = this._adminService.getGroupsWithUsersObservable();
    this.selectedUser$ = this._userResultsService.getSelectedUserObservable();
    this.progress$ = this._userResultsService.getSelectedUserProgressObservable();

    this.groupsWithUsers$.pipe(takeUntil(this._unsubscribe)).subscribe((groups) => {
      this.groupsDataSourceMap.clear();
      this.groupNamesMap.clear();

      for (const [index, group] of groups.entries()) {
        const datasource = new MatTableDataSource(group.users);
        if (this.matPaginators?.length) {
          datasource.paginator = this.matPaginators.toArray().at(index);
        }
        this.groupNamesMap.set(group.id, group.name);
        this.groupsDataSourceMap.set(group.id, datasource);
      }
    });

    this.progress$.pipe(takeUntil(this._unsubscribe)).subscribe((progress) => {
      if (!progress) {
        this.progressDataSource.data = [];
        return;
      }
      this.progressDataSource.data = progress.progressItems;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._userResultsService.destroy();
  }

  public onDetailsClick(user: UserShortData): void {
    this._userResultsService.setSelectedUserProgress(null);
    this._userResultsService.setSelectedUser(user);
  }

  public getBarValue(sectionType: SectionType): number {
    const progress = this._userResultsService.getSelectedUserProgress();
    if (!progress) {
      return 0;
    }

    const bar = progress.progressBars.find((bar) => bar.sectionType === sectionType);
    return bar.totalProgressItems !== 0
      ? Math.round(bar.finishedProgressItems / bar.totalProgressItems) * 100
      : 0;
  }

  public getMarkLabel(progressItem: IProgressItem): string {
    if (progressItem.type === 'EXERCISE') {
      const exerciseData = progressItem.itemData as IProgressExerciseData;
      return `${exerciseData.mark}`;
    }

    return '-';
  }

  public getPointsLabel(progressItem: IProgressItem): string {
    if (progressItem.type === 'EXERCISE') {
      const fromLabel = this._translateService.instant('FROM');
      const exerciseData = progressItem.itemData as IProgressExerciseData;
      return `${exerciseData.earnedPoints} ${fromLabel} ${exerciseData.maxPoints}`;
    }

    return '-';
  }
}
