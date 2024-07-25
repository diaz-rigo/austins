import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/Product.models';
import { ProductService } from '../../commons/services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { OpenDeleteConfirmationComponent } from '../../commons/components/open-delete-confirmation/open-delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponentComponent } from '../../commons/components/edit-product-component/edit-product-component.component';
import { CreateProductComponentComponent } from '../../commons/components/create-product-component/create-product-component.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ReviewService } from '../../commons/services/review.service';
import { PredictionServiceService } from '../../commons/services/prediction-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.view.html',
  styleUrls: ['./product-list.view.scss'],
  providers: [MessageService]  // Asegúrate de incluir MessageService si usas PrimeNG para mensajes

})
export class ProductListView implements OnInit {
  products: Product[] = [];
  producto: Product;

  displayedColumns: string[] = [
    'name',
    'image',
    'price',
    'weight',
    'category',
    'status',
    'predict',

    'actions',
  ];
  pageSizeOptions: number[] = [3, 10, 25];
  pageIndex: number = 0;
  pageSize: number = 3;
  totalProducts: number = 0;
  searchForm: FormGroup;
  @Input()
  images!: string[];
  srcMain!: string;
  isMobile: boolean = false;
  reviews: any[] = [];
  topReview: any;
  predictionResult: string = '';
  displayDialog: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,    private reviewService: ReviewService,    private predictionService: PredictionServiceService,    private messageService: MessageService



  ) {
    this.producto = new Product();

    this.searchForm = this.fb.group({
      query: [''],
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.searchProducts();
      });
  }
  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      this.isMobile = result.matches;
    });
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  loadProducts(): void {
    const skip = this.pageIndex * this.pageSize;
    const limit = this.pageSize;

    const filters = {
      name: this.searchForm.value.query,
      // Otros campos de filtrado que recolectes de la vista
      priceMin: this.searchForm.value.priceMin,
      priceMax: this.searchForm.value.priceMax,
      category: this.searchForm.value.category,
      maker: this.searchForm.value.maker,
    };

    this.productService
      .getProducts(skip, limit, filters)
      .subscribe((data: Product[]) => {
        this.products = data;
        this.products.forEach(product => {
          this.reviewService.getProductReviews(product._id).subscribe(reviews => {
          });
        });
      });
  }
  isProductPopular(reviews: any[]): boolean {
    if (reviews.length === 0) return false;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return averageRating >= 4; // Define el umbral para popularidad
  }

  searchProducts(): void {
    this.loadProducts();
  }
  getImages(url: string): string {
    return `${environment.api}/${url}`;
  }

  // Nueva función para eliminar un producto
  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(
      (result: { id: string }) => {
        // Manejar la respuesta de eliminación, por ejemplo, mostrar un mensaje de éxito.
        // console.log('Producto eliminado con éxito', result);
        // Después de eliminar, puedes cargar nuevamente la lista de productos si lo deseas.
        this.loadProducts();
      },
      (error) => {
        // Manejar errores, por ejemplo, mostrar un mensaje de error.
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  openDeleteConfirmation(product: Product): void {
    const dialogRef = this.dialog.open(OpenDeleteConfirmationComponent, {
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        // Lógica para eliminar el producto aquí
        this.deleteProduct(product._id);
      }
    });
  }
  // // Función para actualizar un producto
  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe(
      (updatedProduct: Product) => {
        // Manejar la respuesta actualizada, por ejemplo, mostrar un mensaje de éxito.
        // console.log('Producto actualizado con éxito', updatedProduct);
        // Actualiza la lista de productos después de la edición
        this.loadProducts();
      },
      (error) => {
        // Manejar errores, por ejemplo, mostrar un mensaje de error.
        console.error('Error al actualizar el producto', error);
      }
    );
  }
  predecir(product: Product): void {
    console.log('Product data:', product);

    // Obtener las reseñas del producto
    this.reviewService.getProductReviews(product._id).subscribe(
      (reviews) => {
        this.reviews = reviews;
        console.log('List of reviews:', this.reviews);

        // Verificar si hay reseñas
        if (this.reviews.length === 0) {
          console.log('No reviews found for this product.');
          this.messageService.add({severity: 'info', summary: 'No Reviews', detail: 'This product has no reviews and is not popular.'});
          return; // Salir de la función si no hay reseñas
        }

        // Obtener la reseña principal
        this.topReview = this.getTopReview(reviews);
        console.log('Top review:', this.topReview);

        // Preparar los datos para la predicción
        const predictionData = this.preparePredictionData(product, this.reviews);
        this.predictionService.predict(predictionData).subscribe(
          (response) => {
            console.log('Prediction result:', response);
            this.predictionResult = response.prediction;
            this.displayDialog = true;  // Mostrar el diálogo
          },
          (error) => {
            this.predictionResult = error;
            this.displayDialog = true;
            console.error('Error predicting:', error);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error predicting data.'});
          }
        );

      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  private getTopReview(reviews: any[]): any {
    // Encuentra la reseña con la mejor calificación (puedes ajustar esta lógica según sea necesario)
    return reviews.reduce((top, review) => review.rating > top.rating ? review : top, reviews[0]);
  }

  private preparePredictionData(product: Product, reviews: any[]): any {
    // Extraer los datos necesarios
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewCount;

    // Mapear los datos del producto a un formato adecuado
    // return {
    //   price: 460.1,
    //   quantity_sold: 74,
    //   customer_rating: 5,
    //   review_count: 4,
    //   category: 'pastry',
    //   store_location: 'urban',
    //   discount_offered: 0.0918089775,
    //   customer_age_group: 'child',
    //   purchase_day: 'Tuesday',
    //   promotion_applied: 1,
    //   payment_method: 'credit_card',
    //   delivery_method: 'home_delivery'
    // };

    return {
      price: product.price,
      quantity_sold: Number(product.quantity), // Asegúrate de convertir a número
      customer_rating: Math.round(averageRating), // Ajustar a un número entero similar al ejemplo
      review_count: reviewCount,
      category: this.mapCategory(product.category), // Ajustar el nombre de la categoría si es necesario
      store_location: 'urban', // Esto puede variar según tu contexto
      discount_offered: 0.0918089775, // Ejemplo fijo, ajustar según sea necesario
      customer_age_group: 'child', // Ejemplo fijo, ajustar según sea necesario
      purchase_day: 'Tuesday', // Ejemplo fijo, ajustar según sea necesario
      promotion_applied: 1, // Ejemplo fijo, ajustar según sea necesario
      payment_method: 'credit_card', // Ejemplo fijo, ajustar según sea necesario
      delivery_method: 'home_delivery' // Ejemplo fijo, ajustar según sea necesario
    };
  }

  private mapCategory(category: string): string {
    // Define el tipo del mapa de categorías
    const categoryMap: { [key: string]: string } = {
      'PastelFinos': 'pastry',
      // Agrega otros mapeos si es necesario
    };

    return categoryMap[category] || category; // Retorna la categoría mapeada o la original si no se encuentra
  }


  openEditModal(product: Product): void {
    const isMobile = window.innerWidth < 480;
    const dialogRef = this.dialog.open(EditProductComponentComponent, {
      width: isMobile ? '120vw' : '800px',
      height: isMobile ? '700px' : '600px',
      maxWidth: isMobile ? 'auto' : 'auto',
      maxHeight: isMobile ? '100vh' : 'auto',
      panelClass: isMobile
        ? ['mat-dialog', 'no-padding', 'mobile-dialog']
        : ['mat-dialog', 'no-padding', 'web-dialog'],
      data: { product }, // Pasa el producto al modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Lógica para manejar la actualización del producto aquí
        this.updateProduct(result); // Llama a la función de actualización con los datos editados
        // console.log(result);
        // Carga nuevamente los productos para reflejar los cambios en la lista
        this.loadProducts();
      }
    });
  }

  openCreateModal() {
    const isMobile = window.innerWidth < 480;

    const dialogRef = this.dialog.open(CreateProductComponentComponent, {
      width: isMobile ? '120vw' : '800px',
      height: isMobile ? '700px' : '600px',
      maxWidth: isMobile ? 'auto' : 'auto',
      maxHeight: isMobile ? '100vh' : 'auto',
      panelClass: isMobile
        ? ['mat-dialog', 'no-padding', 'mobile-dialog']
        : ['mat-dialog', 'no-padding', 'web-dialog'],
      // data: {},
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts(); // Asegúrate de que loadProducts realiza la lógica adecuada para cargar la lista de productos
        // console.log('Producto creado con éxito', result);
      }
    });
  }

  // getProductReviews(product: Product) {
  //   this.reviewService.getProductReviews(product._id).subscribe(
  //     (reviews) => {
  //       this.reviews = reviews;
  //       this.topReview = this.getTopReview(reviews);
  //       console.log("Top review:", this.topReview);
  //     },
  //     (error) => {
  //       console.error('Error fetching reviews:', error);
  //     }
  //   );
  // }

  // getTopReview(reviews: any[]): any {
  //   if (reviews.length === 0) return null;
  //   return reviews.reduce((top, current) => (current.rating > top.rating ? current : top), reviews[0]);
  // }
}
