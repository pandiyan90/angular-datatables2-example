# Building Dynamic Chuck Norris Jokes with Angular DataTables 2

In our Angular project, we showcase how to dynamically display Chuck Norris jokes using Angular DataTables. This involves a seamless integration of ng-template, *ngTemplateOutlet, and AfterViewInit to ensure efficient data loading and rendering.

Project Overview
This project, generated with Angular CLI version 17.3.7, leverages Angular DataTables to manage and display jokes fetched from an external API. The primary focus is on how the interplay between Angular directives and lifecycle hooks enables dynamic and responsive data handling.

Key Concepts
1. Defining the Template with ng-template
We use ng-template to define a reusable block of HTML named #preview, which serves as the blueprint for our DataTable structure:
````
  <ng-template #preview>
    <table datatable [dtOptions]="dtOptions" [dtTrigger]="dtTrigger" class="row-border hover"></table>
  </ng-template>ht
````
This template provides the visual framework for the DataTable but does not manage the data directly.

2. Dynamic Rendering with *ngTemplateOutlet
The *ngTemplateOutlet directive allows us to dynamically render the #preview template within the component's layout:
````
<div *ngIf="dataLoaded">
  <ng-container *ngTemplateOutlet="preview"></ng-container>
</div>
````
This enables flexibility in positioning the DataTable and controlling its display based on conditions.

3. Lifecycle Management with AfterViewInit
The AfterViewInit lifecycle hook is crucial for ensuring the DataTable is ready for data fetching and display. It initializes the dtOptions configuration and triggers data loading:
````
dtOptions: ADTSettings = {};
dtTrigger: Subject<ADTSettings> = new Subject();
  ngOnInit(): void {
    this.dtOptions = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        let search = dataTablesParameters.search.value;
        if (!search) {
          search = 'Welcome';
        }

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
        { title: 'URL', data: 'url' },
        { title: 'Joke', data: 'value' },
        { title: 'Updated', data: 'updated_at' }
      ]
    };
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dtTrigger.next(this.dtOptions);
    }, 200);
  }
````
This ensures:

The template structure (ng-template) is defined.
The data fetching configuration (dtOptions) is set.
The view initialization is complete (AfterViewInit).
Why This Matters
Combining these elements ensures that the DataTable is not only structured properly but also dynamically populated with Chuck Norris jokes from the API. This approach guarantees that the data is fetched and displayed efficiently, enhancing the user experience.

Conclusion
By leveraging ng-template, *ngTemplateOutlet, and AfterViewInit, we create a robust and dynamic DataTable in our Angular project. This method ensures that our DataTable is both visually appealing and functionally efficient, providing a seamless display of Chuck Norris jokes.
