import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as state from '../../state/bookState'
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-book',
  styleUrl: './book.css',
  templateUrl: './book.html',
})
export class Book implements OnInit{
  store=inject(Store)
  allBooks$!:Observable<state.Book[]>
  loading$!:Observable<boolean>
  error$!:Observable<any>
  constructor(){
    this.allBooks$=this.store.select(state.selectallbooks)
    this.loading$=this.store.select(state.loading)
    this.error$=this.store.select(state.error)
  }

  ngOnInit(): void {
    this.store.dispatch(state.loadAllBooks())
  }

  addBook(id:string){
    this.store.dispatch(state.addBook({id}))
  }
}
