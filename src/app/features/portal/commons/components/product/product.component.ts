import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { CartService } from 'src/app/core/services/cart.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Product } from 'src/app/features/admin/models/Product.models';
import { CartItem } from 'src/app/shared/models/cart.model';
import { SearchService } from 'src/app/shared/services/search-service.service';
import { SidebarServiceService } from 'src/app/shared/services/sidebar-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [HeaderComponent],

})
export class ProductComponent implements OnInit {

  @Input() product!: Product;
  hasSearchResults = true;
  filterPost = '';
  items: number = 0;

  get cartItem(): CartItem {
    return this.setCartItem();
  }

  constructor(
    private SidebarServiceService: SidebarServiceService,    private storageService: StorageService,
    private router: Router,
    private cartService: CartService,
    private headerComponent: HeaderComponent,
    private searchService: SearchService // Inyecta el servicio de búsqueda
  ) {}

  ngOnInit(): void {}



  setCartItem(): CartItem {
    const cartItem: CartItem = {
      id: this.product._id,
      name: this.product.name,
      precio: this.product.price,
      cantidad: 1,
      image: this.product.images,
    };
    return cartItem;
  }
  add(): void {
    this.cartService.add(this.cartItem);

    // Mostrar el sidebar después de 1 segundo
    setTimeout(() => {
      this.SidebarServiceService.setSidebarVisible2(true);
      
      // Ocultar el sidebar después de 3 segundos
      setTimeout(() => {
        this.SidebarServiceService.setSidebarVisible2(false);
      }, 2000); // 3000 milisegundos = 3 segundos
    }, 1000); // 1000 milisegundos = 1 segundo
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

  goToDetail(): void {
    this.router.navigateByUrl(`portal/detail/${this.product._id}`);
  }
}
