import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';

import {SharedModule} from '../shared/shared.module';

import {AlibabaBasicNodeDataComponent} from './basic/provider/alibaba/component';
import {AWSBasicNodeDataComponent} from './basic/provider/aws/component';
import {AzureBasicNodeDataComponent} from './basic/provider/azure/component';
import {BasicNodeDataComponent} from './basic/provider/component';
import {DigitalOceanBasicNodeDataComponent} from './basic/provider/digitalocean/component';
import {GCPBasicNodeDataComponent} from './basic/provider/gcp/component';
import {HetznerBasicNodeDataComponent} from './basic/provider/hetzner/component';
import {KubeVirtBasicNodeDataComponent} from './basic/provider/kubevirt/component';
import {OpenstackBasicNodeDataComponent} from './basic/provider/openstack/component';
import {PacketBasicNodeDataComponent} from './basic/provider/packet/component';
import {VSphereBasicNodeDataComponent} from './basic/provider/vsphere/component';
import {NodeDataComponent} from './component';
import {ExtendedNodeDataComponent} from './extended/component';
import {AlibabaExtendedNodeDataComponent} from './extended/provider/alibaba/component';
import {AWSExtendedNodeDataComponent} from './extended/provider/aws/component';
import {AzureExtendedNodeDataComponent} from './extended/provider/azure/component';
import {DigitalOceanExtendedNodeDataComponent} from './extended/provider/digitalocean/component';
import {GCPExtendedNodeDataComponent} from './extended/provider/gcp/component';
import {OpenstackExtendedNodeDataComponent} from './extended/provider/openstack/component';
import {PacketExtendedNodeDataComponent} from './extended/provider/packet/component';
import {VSphereExtendedNodeDataComponent} from './extended/provider/vsphere/component';
import {NodeDataService} from './service/service';

const components = [
  AlibabaBasicNodeDataComponent,
  AlibabaExtendedNodeDataComponent,
  AWSBasicNodeDataComponent,
  AWSExtendedNodeDataComponent,
  DigitalOceanBasicNodeDataComponent,
  DigitalOceanExtendedNodeDataComponent,
  VSphereBasicNodeDataComponent,
  VSphereExtendedNodeDataComponent,
  KubeVirtBasicNodeDataComponent,
  HetznerBasicNodeDataComponent,
  PacketBasicNodeDataComponent,
  PacketExtendedNodeDataComponent,
  AzureBasicNodeDataComponent,
  AzureExtendedNodeDataComponent,
  GCPBasicNodeDataComponent,
  GCPExtendedNodeDataComponent,
  OpenstackBasicNodeDataComponent,
  OpenstackExtendedNodeDataComponent,
  NodeDataComponent,
  BasicNodeDataComponent,
  ExtendedNodeDataComponent,
];

const services = [NodeDataService];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  declarations: [...components],
  providers: [...services],
  exports: [...components],
})
export class NodeDataModule {}
