import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {merge, Observable} from 'rxjs';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {FilteredComboboxComponent} from '../../../../shared/components/combobox/component';
import {GCPNodeSpec} from '../../../../shared/entity/node/GCPNodeSpec';
import {NodeCloudSpec, NodeSpec} from '../../../../shared/entity/NodeEntity';
import {GCPDiskType, GCPMachineSize, GCPZone} from '../../../../shared/entity/provider/gcp/GCP';
import {NodeData} from '../../../../shared/model/NodeSpecChange';
import {BaseFormValidator} from '../../../../shared/validators/base-form.validator';
import {NodeDataService} from '../../../service/service';

enum Controls {
  DiskSize = 'diskSize',
  DiskType = 'diskType',
  Zone = 'zone',
  MachineType = 'machineType',
  Preemptible = 'preemptible',
}

enum ZoneState {
  Ready = 'Zone',
  Loading = 'Loading...',
  Empty = 'No Zones Available',
}

enum DiskTypeState {
  Ready = 'Disk Type',
  Loading = 'Loading...',
  Empty = 'No Disk Types Available',
}

enum MachineTypeState {
  Ready = 'Machine Type',
  Loading = 'Loading...',
  Empty = 'No Machine Types Available',
}

@Component({
  selector: 'km-gcp-basic-node-data',
  templateUrl: './template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GCPBasicNodeDataComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GCPBasicNodeDataComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GCPBasicNodeDataComponent extends BaseFormValidator implements OnInit, OnDestroy {
  private _zoneChanges = new EventEmitter<boolean>();

  readonly Controls = Controls;

  machineTypes: GCPMachineSize[] = [];
  selectedMachineType = '';
  machineTypeLabel = MachineTypeState.Empty;
  zones: GCPZone[] = [];
  selectedZone = '';
  zoneLabel = ZoneState.Empty;
  diskTypes: GCPDiskType[] = [];
  selectedDiskType = '';
  diskTypeLabel = DiskTypeState.Empty;

  @ViewChild('zonesCombobox') private _zonesCombobox: FilteredComboboxComponent;
  @ViewChild('diskTypesCombobox')
  private _diskTypesCombobox: FilteredComboboxComponent;
  @ViewChild('machineTypesCombobox')
  private _machineTypesCombobox: FilteredComboboxComponent;

  constructor(
    private readonly _builder: FormBuilder,
    private readonly _nodeDataService: NodeDataService,
    private readonly _cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.DiskSize]: this._builder.control(25, Validators.required),
      [Controls.DiskType]: this._builder.control('', Validators.required),
      [Controls.Zone]: this._builder.control('', Validators.required),
      [Controls.MachineType]: this._builder.control('', Validators.required),
      [Controls.Preemptible]: this._builder.control(''),
    });

    this._nodeDataService.nodeData = this._getNodeData();
    this._zonesObservable.pipe(takeUntil(this._unsubscribe)).subscribe(this._setDefaultZone.bind(this));

    this._zoneChanges
      .pipe(filter(hasValue => hasValue))
      .pipe(switchMap(_ => this._diskTypesObservable))
      .pipe(tap(this._setDefaultDiskType.bind(this)))
      .pipe(switchMap(_ => this._machineTypesObservable))
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(this._setDefaultMachineType.bind(this));

    merge(this.form.get(Controls.DiskSize).valueChanges, this.form.get(Controls.Preemptible).valueChanges)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(_ => (this._nodeDataService.nodeData = this._getNodeData()));
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onZoneChange(zone: string): void {
    this._nodeDataService.nodeData.spec.cloud.gcp.zone = zone;
    this._zoneChanges.emit(!!zone);
  }

  onDiskTypeChange(diskType: string): void {
    this._nodeDataService.nodeData.spec.cloud.gcp.diskType = diskType;
  }

  onMachineTypeChange(machineType: string): void {
    this._nodeDataService.nodeData.spec.cloud.gcp.machineType = machineType;
  }

  private get _zonesObservable(): Observable<GCPZone[]> {
    return this._nodeDataService.gcp
      .zones(this._clearZone.bind(this), this._onZoneLoading.bind(this))
      .pipe(map((zones: GCPZone[]) => zones.sort((a, b) => a.name.localeCompare(b.name))));
  }

  private _clearZone(): void {
    this.zones = [];
    this.selectedZone = '';
    this.zoneLabel = ZoneState.Empty;
    this._zonesCombobox.reset();
    this._cdr.detectChanges();
  }

  private _onZoneLoading(): void {
    this._clearZone();
    this.zoneLabel = ZoneState.Loading;
    this._cdr.detectChanges();
  }

  private _setDefaultZone(zones: GCPZone[]): void {
    this.zones = zones;
    if (this.zones.length > 0) {
      this.selectedZone = this.zones[0].name;
      this.zoneLabel = ZoneState.Ready;
      this._cdr.detectChanges();
    }
  }

  private get _diskTypesObservable(): Observable<GCPDiskType[]> {
    return this._nodeDataService.gcp
      .diskTypes(this._clearDiskTypes.bind(this), this._onDiskTypeLoading.bind(this))
      .pipe(map((types: GCPDiskType[]) => types.sort((a, b) => a.name.localeCompare(b.name))));
  }

  private _clearDiskTypes(): void {
    this.diskTypes = [];
    this.selectedDiskType = '';
    this.diskTypeLabel = DiskTypeState.Empty;
    this._diskTypesCombobox.reset();
    this._cdr.detectChanges();
  }

  private _onDiskTypeLoading(): void {
    this._clearDiskTypes();
    this.diskTypeLabel = DiskTypeState.Loading;
    this._cdr.detectChanges();
  }

  private _setDefaultDiskType(diskTypes: GCPDiskType[]): void {
    this.diskTypes = diskTypes;
    if (this.diskTypes.length > 0) {
      this.selectedDiskType = this.diskTypes[0].name;
      this.diskTypeLabel = DiskTypeState.Ready;
      this._cdr.detectChanges();
    }
  }

  private get _machineTypesObservable(): Observable<GCPMachineSize[]> {
    return this._nodeDataService.gcp
      .machineTypes(this._clearMachineType.bind(this), this._onMachineTypeLoading.bind(this))
      .pipe(map((sizes: GCPMachineSize[]) => sizes.sort((a, b) => a.name.localeCompare(b.name))));
  }

  private _clearMachineType(): void {
    this.machineTypes = [];
    this.selectedMachineType = '';
    this.machineTypeLabel = MachineTypeState.Empty;
    this._machineTypesCombobox.reset();
    this._cdr.detectChanges();
  }

  private _onMachineTypeLoading(): void {
    this._clearMachineType();
    this.machineTypeLabel = MachineTypeState.Loading;
    this._cdr.detectChanges();
  }

  private _setDefaultMachineType(machineTypes: GCPMachineSize[]): void {
    this.machineTypes = machineTypes;
    if (this.machineTypes.length > 0) {
      this.selectedMachineType = this.machineTypes[0].name;
      this.machineTypeLabel = MachineTypeState.Ready;
      this._cdr.detectChanges();
    }
  }

  private _getNodeData(): NodeData {
    return {
      spec: {
        cloud: {
          gcp: {
            diskSize: this.form.get(Controls.DiskSize).value,
            preemptible: this.form.get(Controls.Preemptible).value,
          } as GCPNodeSpec,
        } as NodeCloudSpec,
      } as NodeSpec,
    } as NodeData;
  }
}
