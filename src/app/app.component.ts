import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { ApiResponse } from './apiresponse';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, DataTablesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'angular-datatables2-example';

  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject();

  jokes?: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: true,
      destroy: true,
      serverSide: true,
      processing: true,
      lengthChange: true,
      searching: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        const pageNo = dataTablesParameters.start / dataTablesParameters.length + 1;
        const pageSize = dataTablesParameters.length;
        let search = dataTablesParameters.search.value;
        if (!search) {
          search = 'Welcome';
        }
        const sortBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        const sortDir = dataTablesParameters.order[0].dir;

        this.http.get<ApiResponse>('https://api.chucknorris.io/jokes/search?query='+search)
        .subscribe(resp => {
          callback({
            recordsTotal: resp.total,
            recordsFiltered: resp.total,
            data: resp.result
          });
        });
      },
      columns: [
        { title: 'Id', data: 'id' },
        { title: 'URL', data: 'url' },
        { title: 'Joke', data: 'value' }
      ]
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  fetchJoke() {
    this.http.get<ApiResponse>('https://api.chucknorris.io/jokes/search?query=joke')
      .subscribe(data => this.jokes = data.result);
  }

}
