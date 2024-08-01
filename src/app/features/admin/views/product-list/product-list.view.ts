import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/Product.models';
import { ProductService } from '../../commons/services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { OpenDeleteConfirmationComponent } from '../../commons/components/open-delete-confirmation/open-delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponentComponent } from '../../commons/components/create-product-component/create-product-component.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.view.html',
  styleUrls: ['./product-list.view.scss'],
  providers: [DialogService, ConfirmationService, MessageService],
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
  ref: DynamicDialogRef | undefined

  constructor(private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,    private dialogService: DialogService,
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

  createprod() {
    this.openProductDialog(false, null);
  }

  editprod(product: Product) { // Cambia 'any' por 'IProduct'
    console.log(product)
    this.openProductDialog(true, product);
  }

  private openProductDialog(isEditing: boolean, product: Product | null) {
    const isMobile = window.innerWidth < 480
    console.log(product)
    this.ref = this.dialogService.open(CreateProductComponentComponent, {
      header: isEditing ? 'Editar Producto' : 'Nuevo Producto',
      height: isMobile ? 'auto' : 'auto',
      style: {
        'max-width': isMobile ? '110vw' : 'auto',
        'max-height': isMobile ? 'auto' : '100vh',
        padding: '0', // Aquí estableces el padding a 0
      },
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '100vw',
      },
      data: { product }, // Pasando el objeto product dentro de un objeto con la propiedad 'product'

    })
  }
  getSeverity(status: string): string {
    switch (status) {
        case 'ACTIVE':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'INACTIVE':
            return 'danger';
        default:
            return 'default'; // O cualquier otro valor que desees utilizar para los casos no manejados
    }
}
  geIcon(status: string): string {
    switch (status) {
        case 'ACTIVE':
            return 'pi pi-check';
        case 'LOWSTOCK':
            return 'warning';
        case 'INACTIVE':
            return 'pi pi-times';
        default:
            return 'default'; // O cualquier otro valor que desees utilizar para los casos no manejados
    }
}

  checarsta(status: string): string {
    switch (status) {
      case 'ACTIVE':
          return 'ACTIVE';
      case 'INACTIVE':
          return 'INACTIVE';
      case 'true':
          return 'ACTIVE';
      case 'false':
          return 'INACTIVE';
      default:
          return 'default'; // O cualquier otro valor que desees utilizar para los casos no manejados
  }
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
      });
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

    console.log(product)
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

  onPageChange(event: any): void {
    this.pageIndex = event.first / event.rows;  // Calcula pageIndex
    this.pageSize = event.rows;  // Asigna pageSize
    this.loadProducts();
  }

  // openEditModal(product: Product): void {
  //   const isMobile = window.innerWidth < 480;
  //   const dialogRef = this.dialog.open(EditProductComponentComponent, {
  //     width: isMobile ? '120vw' : '800px',
  //     height: isMobile ? '700px' : '600px',
  //     maxWidth: isMobile ? 'auto' : 'auto',
  //     maxHeight: isMobile ? '100vh' : 'auto',
  //     panelClass: isMobile
  //       ? ['mat-dialog', 'no-padding', 'mobile-dialog']
  //       : ['mat-dialog', 'no-padding', 'web-dialog'],
  //     data: { product }, // Pasa el producto al modal
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       // Lógica para manejar la actualización del producto aquí
  //       this.updateProduct(result); // Llama a la función de actualización con los datos editados
  //       // console.log(result);
  //       // Carga nuevamente los productos para reflejar los cambios en la lista
  //       this.loadProducts();
  //     }
  //   });
  // }

  // openCreateModal() {
  //   const isMobile = window.innerWidth < 480;

  //   const dialogRef = this.dialog.open(CreateProductComponentComponent, {
  //     width: isMobile ? '120vw' : '800px',
  //     height: isMobile ? '700px' : '600px',
  //     maxWidth: isMobile ? 'auto' : 'auto',
  //     maxHeight: isMobile ? '100vh' : 'auto',
  //     panelClass: isMobile
  //       ? ['mat-dialog', 'no-padding', 'mobile-dialog']
  //       : ['mat-dialog', 'no-padding', 'web-dialog'],
  //     // data: {},
  //     data: {},
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.loadProducts(); // Asegúrate de que loadProducts realiza la lógica adecuada para cargar la lista de productos
  //       // console.log('Producto creado con éxito', result);
  //     }
  //   });
  // }
}
