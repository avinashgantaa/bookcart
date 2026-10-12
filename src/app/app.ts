import { Component, signal } from '@angular/core';
import { Book } from './compoents/book/book';
import { Cart } from './compoents/cart/cart';

@Component({
  selector: 'app-root',
  imports: [Book, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce');
}
