// import { Component, OnInit, Input } from '@angular/core';
// import { Router } from '@angular/router';
// import { CartService } from 'src/app/core/services/cart.service';
// import { ReviewService } from 'src/app/features/admin/commons/services/review.service';
// import { Product } from 'src/app/features/admin/models/Product.models';
// import { CartItem } from 'src/app/shared/models/cart.model';
// import { SearchService } from 'src/app/shared/services/search-service.service';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-product',
//   templateUrl: './product.component.html',
//   styleUrls: ['./product.component.scss'],
// })
// export class ProductComponent implements OnInit {


//   @Input() product!: Product;
//   hasSearchResults = true;
//   filterPost = '';
//   items: number = 0;
//   reviews: any[] = [];
//   get cartItem(): CartItem {
//     return this.setCartItem();
//   }
//   constructor(
//     private router: Router,
//     private cartService: CartService,
//     private reviewService: ReviewService,
//     private searchService: SearchService // Inyecta el servicio de búsqueda
//   ) {}

//   ngOnInit(): void {
//     this.getProductReviews();
//   }
//   setCartItem(): CartItem {
//     // console.log('set car', this.product);
//     const cartItem: CartItem = {
//       id: this.product._id,
//       name: this.product.name,
//       precio: this.product.price,
//       cantidad: 1,
//       image: this.product.images,
//     };
//     return cartItem;
//   }

//   add(): void {
//     this.cartService.add(this.cartItem);
//   }

//   getImages(url: string): string {
//     return `${environment.api}/${url}`;
//   }

//   increment(): void {
//     this.cartService.add(this.cartItem);
//   }

//   decrement(): void {
//     this.cartService.remove(this.cartItem);
//   }
//   goToDetail(): void {
//     this.router.navigateByUrl(`portal/detail/${this.product._id}`);
//   }

//   getProductReviews() {
//     this.reviewService.getProductReviews(this.product._id).subscribe(
//       (reviews) => {
//         this.reviews = reviews;
//         console.log("---->",this.reviews)
//       },
//       (error) => {
//         console.error('Error fetching reviews:', error);
//       }
//     );
//   }
// }
