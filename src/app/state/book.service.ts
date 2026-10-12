import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, throwError } from 'rxjs';
import { Book } from './bookState';

@Injectable({ providedIn: 'root' })
export class BookService {
  http = inject(HttpClient);
  baseurl = 'http://localhost:3000/books';
  getallBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseurl).pipe(
      delay(1000),
      catchError((error) => throwError(() => error)),
    );
  }
}
