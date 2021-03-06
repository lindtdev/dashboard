import {HttpClientModule} from '@angular/common/http';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from '../../shared/shared.module';
import {fakeDigitaloceanCluster} from '../../testing/fake-data/cluster.fake';
import {DatacenterMockService} from '../../testing/services/datacenter-mock.service';
import {SetDatacenterComponent} from './set-datacenter.component';
import {AuthMockService} from '../../testing/services/auth-mock.service';
import {Auth, WizardService, DatacenterService} from '../../core/services';

describe('SetDatacenterComponent', () => {
  let fixture: ComponentFixture<SetDatacenterComponent>;
  let component: SetDatacenterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        MatButtonToggleModule,
        HttpClientModule,
      ],
      declarations: [SetDatacenterComponent],
      providers: [
        WizardService,
        {provide: DatacenterService, useClass: DatacenterMockService},
        {provide: Auth, useClass: AuthMockService},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDatacenterComponent);
    component = fixture.componentInstance;
    component.cluster = fakeDigitaloceanCluster();
    component.cluster.spec.cloud.dc = '';

    fixture.detectChanges();

    fixture.debugElement.injector.get(DatacenterService);
  });

  it('should create the set-datacenter cmp', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid after creating', () => {
    expect(component.setDatacenterForm.valid).toBeFalsy();
  });
});
