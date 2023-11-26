import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/features/admin/models/Product.models';
import { CartItem } from 'src/app/shared/models/cart.model';
import { SearchService } from 'src/app/shared/services/search-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent  implements OnInit {
  
  @Input()product!: Product;
  hasSearchResults = true;
  filterPost = '';
  items: number=0;
  get cartItem(): CartItem {
    return this.setCartItem();
  }
  constructor(
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService, // Inyecta el servicio de búsqueda

  ) {}



  ngOnInit(): void {

    this.searchService.searchQuery$.subscribe((query) => {
      // Filtra los productos en función de la consulta de búsqueda (query).
      this.filterPost = query;

      // Verifica si se han encontrado resultados.
      this.hasSearchResults = this.product.name.toLowerCase().includes(query.toLowerCase());
    });
    console.log('Producto en el presentador', this.product);

  }
  setCartItem(): CartItem {
    console.log('set car', this.product);
    const cartItem: CartItem = {
      id: this.product._id,
      name: this.product.name,
      precio: this.product.price,
      cantidad: 1,
      image: this.product.images
    }
    return cartItem;
  }

  add(): void {
    this.cartService.add(this.cartItem);
  }


  getImages(url: string): string {
    return `${environment.api}/${url}`;
  }

  increment(): void {
    this.cartService.add(this.cartItem);
  }

  decrement(): void {
    this.cartService.remove(this.cartItem);
  }

  goToDetail(route: string): void {
    console.log('redirect');
    this.router.navigateByUrl('/portal/' + route);
  }
}
