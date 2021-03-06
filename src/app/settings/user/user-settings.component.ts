import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {Subject} from 'rxjs';
import {debounceTime, first, switchMap, takeUntil} from 'rxjs/operators';
import {NotificationService, ProjectService, UserService} from '../../core/services';
import {HistoryService} from '../../core/services/history/history.service';
import {SettingsService} from '../../core/services/settings/settings.service';
import {MemberEntity, UserSettings} from '../../shared/entity/MemberEntity';
import {ProjectEntity} from '../../shared/entity/ProjectEntity';
import {objectDiff} from '../../shared/utils/common-utils';

@Component({
  selector: 'km-user-settings',
  templateUrl: 'user-settings.component.html',
  styleUrls: ['user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  itemsPerPageOptions = [5, 10, 15, 20, 25];
  projects: ProjectEntity[] = [];
  user: MemberEntity;
  settings: UserSettings; // Local settings copy. User can edit it.
  apiSettings: UserSettings; // Original settings from the API. Cannot be edited by the user.
  private _settingsChange = new Subject<void>();
  private _unsubscribe = new Subject<void>();

  constructor(
    private readonly _userService: UserService,
    private readonly _settingsService: SettingsService,
    private readonly _historyService: HistoryService,
    private readonly _notificationService: NotificationService,
    private readonly _projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this._userService.loggedInUser.pipe(first()).subscribe(user => (this.user = user));

    this._settingsService.userSettings.pipe(takeUntil(this._unsubscribe)).subscribe(settings => {
      if (!_.isEqual(settings, this.apiSettings)) {
        if (this.apiSettings) {
          this._notificationService.success('An external settings update was applied');
        }
        this.apiSettings = settings;
        this.settings = _.cloneDeep(this.apiSettings);
      }
    });

    this._settingsChange
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this._unsubscribe))
      .pipe(switchMap(() => this._settingsService.patchUserSettings(objectDiff(this.settings, this.apiSettings))))
      .subscribe(settings => {
        this.apiSettings = settings;
        this.settings = _.cloneDeep(this.apiSettings);
        this._settingsService.refreshUserSettings();
      });

    this._projectService.projects.pipe(takeUntil(this._unsubscribe)).subscribe(projects => {
      this.projects = projects;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onSettingsChange(): void {
    this._settingsChange.next();
  }

  goBack(): void {
    this._historyService.goBack('/projects');
  }

  isEqual(a: any, b: any): boolean {
    return _.isEqual(a, b);
  }

  hasDefaultProject(): string {
    return this.settings.selectedProjectId ? '' : '-- None --';
  }

  isAdmin(): boolean {
    return !!this.user && this.user.isAdmin;
  }
}
