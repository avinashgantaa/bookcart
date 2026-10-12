import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createAction,
  createReducer,
  props,
  on,
  createFeatureSelector,
  createSelector,
  State,
} from '@ngrx/store';
import { BookService } from './book.service';
import { catchError, exhaustMap, map, of } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
}

export const loadAllBooks = createAction('[BOOK] LOAD BOOK');
export const loadAllBooksSuccess = createAction(
  '[BOOK] LOAD BOOK SUCCESS',
  props<{ books: Book[] }>(),
);
export const loadAllBooksFail = createAction('[BOOK] LOAD BOOK FAIL', props<{ error: any }>());

//cart
export interface BookCart {
  id: string;
  quantity: number;
}

export interface cartData extends BookCart {
  title: string;
  author: string;
  price: number;
  lineTotal: number;
}
export const addBook = createAction('[BOOK] ADD BOOK', props<{ id: string }>());
export const removeBook = createAction('[BOOK] REMOVE BOOK', props<{ id: string }>());
export const increment = createAction('[BOOK] INCREMENT BOOK QUANTITY', props<{ id: string }>());
export const decrement = createAction('[BOOK] DECREMENT BOOK QUANTITY', props<{ id: string }>());
export const clearCart = createAction('[BOOK] CLEAR CART');

// reducer part

export interface bookState {
  books: Book[];
  loading: boolean;
  error: any;
}

export const BookInitialState: bookState = {
  books: [],
  loading: false,
  error: null,
};

export const bookReducer = createReducer(
  BookInitialState,
  on(loadAllBooks, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(loadAllBooksSuccess, (state, { books }) => {
    return { ...state, books, loading: false, error: null };
  }),
  on(loadAllBooksFail, (state, { error }) => {
    return { ...state, error, loading: false };
  }),
);

export interface cartState {
  cartBook: BookCart[];
}

export const cartList: cartState = {
  cartBook: [],
};

export const cartReducer = createReducer(
  cartList,
  on(addBook, (state, { id }) => {
    let cartbooks: BookCart[];
    let findId = state.cartBook.findIndex((e) => e.id == id);
    if (findId > -1) {
      cartbooks = state.cartBook.map((e, i) =>
        i == findId ? { ...e, quantity: e.quantity + 1 } : e,
      );
    } else {
      cartbooks = [...state.cartBook, { id, quantity: 1 }];
    }
    return {
      ...state,
      cartBook: cartbooks,
    };
  }),
  on(removeBook, (state, { id }) => {
    return { ...state, cartBook: state.cartBook.filter((e) => e.id !== id) };
  }),
  on(increment, (state, { id }) => {
    let cartbooks: BookCart[] = state.cartBook.map((e) =>
      e.id == id ? { ...e, quantity: e.quantity + 1 } : e,
    );
    return { ...state, cartBook: cartbooks };
  }),
  on(decrement, (state, { id }) => {
    let updatedBooks: BookCart[];
    let x = state.cartBook.find((e) => e.id == id);
    if (!x || x.quantity > 1) {
      updatedBooks = state.cartBook.map((e) =>
        e.id == id ? { ...e, quantity: e.quantity - 1 } : e,
      );
    } else {
      updatedBooks = state.cartBook.filter((e) => e.id != id);
    }
    return { ...state, cartBook: updatedBooks };
  }),
  on(clearCart, (state) => {
    return { ...state, cartBook: [] };
  }),
);

//selectors
export const featureKey = createFeatureSelector<bookState>('book');
export const selectallbooks = createSelector(featureKey, (state) => state.books);
export const loading = createSelector(featureKey, (state) => state.loading);
export const error = createSelector(featureKey, (state) => state.error);

export const cartFeatureKey = createFeatureSelector<cartState>('cart');
export const selectcartList = createSelector(cartFeatureKey, (state) => state.cartBook);
export const quantitySelector = createSelector(selectcartList, (state) =>
  state.reduce((ac, q) => ac + q.quantity, 0),
);

export const eachItem = createSelector(selectcartList, selectallbooks, (cart, book): cartData[] => {
  if (book.length == 0) {
    return [];
  }
  return cart.map((e:BookCart) => {
    let product = book.find((b) => b.id == e.id);
    let title = product?.title ||'No title';
    let author = product?.author || "No Author";
    let price = product?.price || 0;
    let lineTotal = price * e.quantity;
    return {
      ...e,
      title,
      author,
      price,
      lineTotal,
    };
  });
});

export const cartValue = createSelector(eachItem, (state) =>
  state.reduce((a, e) => a + e.lineTotal, 0),
);

//effects
@Injectable()
export class bookEffects {
  action = inject(Actions);
  service = inject(BookService);
  bookEffect$ = createEffect(() =>
    this.action.pipe(
      ofType(loadAllBooks),
      exhaustMap(() =>
        this.service.getallBooks().pipe(
          map((books) => loadAllBooksSuccess({ books })),
          catchError((error) => of(loadAllBooksFail({ error }))),
        ),
      ),
    ),
  );
}
