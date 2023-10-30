import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IGroupRef } from 'app/models/group.data';
import { UserShortData } from 'app/models/user.data';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { UserRegistrationService } from './user-registration.service';

@Component({
  selector: 'user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  public displayedColumns = ['firstName', 'lastName', 'group', 'accept', 'decline'];
  public users$: Observable<UserShortData[]>;
  public dataSource = new MatTableDataSource<UserShortData>();
  public isLoadingTableData$ = new BehaviorSubject<boolean>(true);
  public groups$: Observable<IGroupRef[]>;
  public userIdsWithGroups = new Map<string, string>();

  private _usubscribe = new Subject<void>();

  constructor(private _userRegistrationService: UserRegistrationService) {}

  ngOnInit(): void {
    this._userRegistrationService.init();
    this.users$ = this._userRegistrationService
      .getUsersObservable()
      .pipe(map((users) => users.filter((user) => user.confirmationStatus === 'REGISTERED')));
    this.users$.pipe(takeUntil(this._usubscribe)).subscribe((users) => {
      this.dataSource.data = users;
    });
    this.groups$ = this._userRegistrationService.getGroupsObservable();
  }

  ngOnDestroy(): void {
    this._userRegistrationService.destroy();
  }

  public onUserGroupChange(group: IGroupRef, user: UserShortData): void {
    user.groupId = group.id;
    this.userIdsWithGroups.set(user.id, group.id);
  }

  public onAcceptUser(id: string): void {
    this._userRegistrationService.acceptUser(id, this.userIdsWithGroups.get(id));
    this.userIdsWithGroups.delete(id);
  }

  public onDeclineUser(id: string): void {
    this._userRegistrationService.declineUser(id);
    this.userIdsWithGroups.delete(id);
  }
}
