export class AzureSizes {
  name: string;
  numberOfCores: number;
  osDiskSizeInMB: number;
  resourceDiskSizeInMB: number;
  memoryInMB: number;
  maxDataDiskCount: number;
}

export class AzureZones {
  zones: string[];
}
