import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingOverlayService } from '@shared/services';
import { ConfirmDialogService } from 'app/components/confirm-dialog/confirm-dialog.service';
import { RenameDialogService } from 'app/components/rename-dialog/rename-dialog.service';
import { IGroupRef, IGroupWithUsers } from 'app/models/group.data';
import { UserShortData } from 'app/models/user.data';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../admin.service';
import { UserEditingService } from './user-editing.service';

@Component({
  selector: 'users-registration',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent implements OnInit, OnDestroy {
  @ViewChildren(MatPaginator) set matPaginators(paginators: QueryList<MatPaginator>) {
    if (!paginators || !paginators.length) {
      return;
    }
    let index = 0;
    for (const datasource of this.groupsDatasourceMap.values()) {
      datasource.paginator = paginators.toArray().at(index);
      index += index;
    }
    index = 0;
  }

  public groupsWithUsers$: Observable<IGroupWithUsers[]>;
  public displayedColumns = ['firstName', 'lastName', 'group', 'remove', 'overlay'];
  public groupNameControl: FormControl;
  public groupsDatasourceMap = new Map<string, MatTableDataSource<UserShortData>>();
  public usersToRemove: Set<string>;
  public usersControls = new Map<string, FormControl>();
  public isUnsavedChanges$: Observable<boolean>;

  private _unsubscribe = new Subject<void>();

  constructor(
    private _adminService: AdminService,
    private _userEditingService: UserEditingService,
    private _confirmDialogService: ConfirmDialogService,
    private _renameDialogService: RenameDialogService,
    private _loadingOverlayService: LoadingOverlayService
  ) {}

  ngOnInit(): void {
    this._adminService.loadGroupsWithUsers();
    this.groupsWithUsers$ = this._adminService.getGroupsWithUsersObservable();
    this.isUnsavedChanges$ = this._userEditingService.getUnsavedChangesObservable();
    this.groupsWithUsers$.pipe(takeUntil(this._unsubscribe)).subscribe((groups) => {
      this.groupsDatasourceMap.clear();
      this.usersControls.clear();

      for (const [index, group] of groups.entries()) {
        const datasource = new MatTableDataSource(group.users);
        if (this.matPaginators?.length) {
          datasource.paginator = this.matPaginators.toArray().at(index);
        }
        const groupRef: IGroupRef = {
          id: group.id,
          name: group.name
        };
        for (const user of group.users) {
          this.usersControls.set(
            user.id,
            new FormControl(this._userEditingService.getSavedGroupDataForUser(user.id) ?? groupRef)
          );
        }

        this.groupsDatasourceMap.set(group.id, datasource);
      }
    });
    this.usersToRemove = this._userEditingService.getUsersToRemove();
    this.groupNameControl = new FormControl('', [Validators.required, this._uniqueGroupName()]);

    this._userEditingService
      .getActiveSaveRequestObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((isActiveSaveRequest) => {
        if (isActiveSaveRequest) {
          this._loadingOverlayService.showSpinner();
        } else {
          this._loadingOverlayService.hideSpinner();
        }
      });
  }

  ngOnDestroy(): void {
    this._userEditingService.destroy();
  }

  public onUserGroupChange(group: IGroupWithUsers, user: UserShortData): void {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { users, ...groupData } = group;
    this._userEditingService.markUserToUpdate(user);
    this._userEditingService.saveGroupDataForUser(user.id, groupData);
  }

  public onRemoveUser(user: UserShortData): void {
    this._userEditingService.markUserToRemove(user.id);
  }

  public onCancelRemoveUser(user: UserShortData): void {
    this._userEditingService.unmarkUserToRemove(user.id);
  }

  public compareObjectsByIDsFunc(object1: any, object2: any): boolean {
    return object1 && object2 && object1.id === object2.id;
  }

  public onCreateGroup(): void {
    this._adminService.createGroup(this.groupNameControl.value);
    this.groupNameControl.setValue('');
    this.groupNameControl.markAsPristine();
    this.groupNameControl.markAsUntouched();
    this.groupNameControl.updateValueAndValidity();
  }

  public onEditGroupClick(event: MouseEvent, group: IGroupWithUsers): void {
    event.stopPropagation();
    this._renameDialogService
      .rename(
        'RENAME_GROUP_TITLE',
        group.name,
        this._adminService.getGroupsWithUsers().map((group) => group.name)
      )
      .subscribe((newName: string) => {
        if (newName) {
          group.name = newName;
          this._userEditingService.markGroupToUpdate(group);
        }
      });
  }

  public onRemoveGroupClick(event: MouseEvent, group: IGroupWithUsers): void {
    event.stopPropagation();
    this._confirmDialogService
      .confirm('REMOVE_GROUP_TITLE', 'REMOVE_GROUP_MESSAGE', 'CANCEL', 'CONFIRM', `${group.name}`)
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this._userEditingService.markGroupToRemove(group.id);
        }
      });
  }

  public onSaveChanges(): void {
    this._userEditingService.saveChanges();
  }

  private _uniqueGroupName(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      return this._adminService.getGroupsWithUsers().some((group) => group.name === control.value)
        ? { nonuniqueName: true }
        : null;
    };
  }
}
