import { Injectable } from '@angular/core';
import { Jsonp, Headers } from '@angular/http';
import { Subject, Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { ILocation } from '../interfaces/location';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class GoogleAPIService {
  private googleReadyObservable;
  constructor(
    private jsonp: Jsonp,
    private http: HttpClient
  ) {
    this.googleReadyObservable = new Subject();
    this.jsonp
      .get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyAWoCHGzZmNSFKhEbDjsughQ4x8BXmNvT4&callback=JSONP_CALLBACK`)
      .retry()
      .subscribe(res => {
        if (res.status === 200) {
          this.googleReadyObservable.complete();
        }
      });
  };

  googleReady() {
    return this.googleReadyObservable;
  };

  getLocations(): Observable<ILocation> {

    return this.http.get<ILocation>("http://localhost:3000/map").pipe(
      tap(data => console.log('Loc: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);

  }
}