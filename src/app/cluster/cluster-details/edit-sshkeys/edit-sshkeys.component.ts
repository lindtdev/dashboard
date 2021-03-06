import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as _ from 'lodash';
import {EMPTY, merge, Subject, timer} from 'rxjs';
import {filter, first, switchMap, takeUntil} from 'rxjs/operators';

import {AppConfigService} from '../../../app-config.service';
import {ClusterService, NotificationService, UserService} from '../../../core/services';
import {GoogleAnalyticsService} from '../../../google-analytics.service';
import {ConfirmationDialogComponent} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {ClusterEntity} from '../../../shared/entity/ClusterEntity';
import {DataCenterEntity} from '../../../shared/entity/DatacenterEntity';
import {MemberEntity} from '../../../shared/entity/MemberEntity';
import {SSHKeyEntity} from '../../../shared/entity/SSHKeyEntity';
import {GroupConfig} from '../../../shared/model/Config';
import {MemberUtils, Permission} from '../../../shared/utils/member-utils/member-utils';

import {AddClusterSSHKeysComponent} from './add-cluster-sshkeys/add-cluster-sshkeys.component';

@Component({
  selector: 'km-edit-sshkeys',
  templateUrl: './edit-sshkeys.component.html',
  styleUrls: ['./edit-sshkeys.component.scss'],
})
export class EditSSHKeysComponent implements OnInit, OnDestroy {
  @Input() cluster: ClusterEntity;
  @Input() datacenter: DataCenterEntity;
  @Input() projectID: string;

  loading = true;
  sshKeys: SSHKeyEntity[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<SSHKeyEntity>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private _user: MemberEntity;
  private _currentGroupConfig: GroupConfig;
  private _unsubscribe: Subject<any> = new Subject();
  private _sshKeysUpdate: Subject<any> = new Subject();

  constructor(
    private readonly _userService: UserService,
    private readonly _appConfig: AppConfigService,
    private readonly _dialog: MatDialog,
    private readonly _clusterService: ClusterService,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    private readonly _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._userService.loggedInUser.pipe(first()).subscribe(user => (this._user = user));

    this._userService
      .currentUserGroup(this.projectID)
      .subscribe(userGroup => (this._currentGroupConfig = this._userService.userGroupConfig(userGroup)));

    this.dataSource.sort = this.sort;
    this.sort.active = 'name';
    this.sort.direction = 'asc';

    merge(timer(0, 5 * this._appConfig.getRefreshTimeBase()), this._sshKeysUpdate)
      .pipe(
        switchMap(() =>
          this.projectID
            ? this._clusterService.sshKeys(this.projectID, this.cluster.id, this.datacenter.metadata.name)
            : EMPTY
        )
      )
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(sshkeys => {
        this.sshKeys = sshkeys;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  getDataSource(): MatTableDataSource<SSHKeyEntity> {
    this.dataSource.data = this.sshKeys;
    return this.dataSource;
  }

  isTableVisible(): boolean {
    return !_.isEmpty(this.sshKeys);
  }

  canAdd(): boolean {
    return MemberUtils.hasPermission(this._user, this._currentGroupConfig, 'sshKeys', Permission.Create);
  }

  addSshKey(): void {
    const dialogRef = this._dialog.open(AddClusterSSHKeysComponent);
    dialogRef.componentInstance.projectID = this.projectID;
    dialogRef.componentInstance.cluster = this.cluster;
    dialogRef.componentInstance.datacenter = this.datacenter;
    dialogRef.componentInstance.sshKeys = this.sshKeys;

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((sshkey: SSHKeyEntity) => {
        if (sshkey) {
          this.sshKeys.push(sshkey);
          this._sshKeysUpdate.next();
        }
      });
  }

  canDelete(): boolean {
    return MemberUtils.hasPermission(this._user, this._currentGroupConfig, 'sshKeys', Permission.Delete);
  }

  deleteSshKey(sshKey: SSHKeyEntity): void {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      data: {
        title: 'Delete SSH Key',
        message: `Are you sure you want to permanently delete SSH key"<strong>${sshKey.name}</strong>"
          from cluster "<strong>${this.cluster.name}</strong>"?`,
        confirmLabel: 'Delete',
      },
    };

    const dialogRef = this._dialog.open(ConfirmationDialogComponent, dialogConfig);
    this._googleAnalyticsService.emitEvent('clusterOverview', 'deleteSshKeyOpened');

    dialogRef
      .afterClosed()
      .pipe(filter(isConfirmed => isConfirmed))
      .pipe(
        switchMap(_ =>
          this._clusterService.deleteSSHKey(this.projectID, this.cluster.id, this.datacenter.metadata.name, sshKey.id)
        )
      )
      .pipe(first())
      .subscribe(() => {
        this._notificationService.success(
          `The <strong>${sshKey.name}</strong> SSH key was removed from the <strong>${this.cluster.name}</strong> cluster`
        );
        this._googleAnalyticsService.emitEvent('clusterOverview', 'SshKeyDeleted');
      });
  }
}
