import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as state from '../../state/bookState';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  store = inject(Store);
  quantity$!: Observable<number>;
  cartItem$!: Observable<state.cartData[]>;
  cartValue$!: Observable<number>;
  constructor() {
    this.cartItem$ = this.store.select(state.eachItem);
    this.cartValue$ = this.store.select(state.cartValue);
  }

  addItem(id: string) {
    this.store.dispatch(state.increment({ id }));
  }

  deleteItem(id: string) {
    this.store.dispatch(state.decrement({ id }));
  }

  clear() {
    this.store.dispatch(state.clearCart());
  }
}
