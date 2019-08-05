import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {DataCenterEntity} from '../../../shared/entity/DatacenterEntity';
import {Auth} from '../auth/auth.service';

@Injectable()
export class DatacenterService {
  private restRoot: string = environment.restRoot;
  private headers: HttpHeaders = new HttpHeaders();

  private dataCenterCache: Observable<DataCenterEntity[]>;

  constructor(private http: HttpClient, private auth: Auth) {
    const token = this.auth.getBearerToken();
    this.headers = this.headers.set('Authorization', 'Bearer ' + token);
  }

  getDataCenters(): Observable<DataCenterEntity[]> {
    const url = `${this.restRoot}/dc`;
    if (!this.dataCenterCache) {
      this.dataCenterCache = this.http.get<DataCenterEntity[]>(url, {headers: this.headers})
                                 .pipe(shareReplay({refCount: true, bufferSize: 1}));
    }
    return this.dataCenterCache;
  }

  getDataCenter(name: string): Observable<DataCenterEntity> {
    return this.getDataCenters().pipe(map((datacenters) => datacenters.find(dc => dc.metadata.name === name)));
  }
}
