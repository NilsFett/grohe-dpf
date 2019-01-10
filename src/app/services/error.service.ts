import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {
  public errors:any[] = [];

  constructor(
  ) {
  }

  public setError(error){
    console.log(error);
    if (error.error.error instanceof ErrorEvent || error.error.error instanceof SyntaxError ) {
      // A client-side or network error occurred. Handle it accordingly.

      this.errors.push(`An error occurred: ${error.error.error.message}:` +
                        `${error.error.text}`);

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.errors.push(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }


    console.log(this.errors);
  }
}
