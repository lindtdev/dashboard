import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {EventEntity} from '../../entity/EventEntity';

@Component({
  selector: 'km-event-list',
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() events: EventEntity[] = [];
  @Input() involvedObjectColumnName = 'Involved Object';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<EventEntity>();
  displayedColumns: string[] = ['type', 'message', 'involvedObjectName', 'count', 'lastTimestamp'];

  ngOnInit(): void {
    this.dataSource.data = this.events;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.events;
  }

  getTypeIcon(event: EventEntity): string {
    switch (event.type) {
      case 'Normal':
        return 'fa fa-info-circle green';
      case 'Warning':
        return 'fa fa-exclamation-circle orange';
      default:
        return 'fa fa-question-circle';
    }
  }
}