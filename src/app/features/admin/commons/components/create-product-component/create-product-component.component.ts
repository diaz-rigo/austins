import { Component, ChangeDetectorRef, Input, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ProductService } from '../../services/product.service'
import { CategoryService } from '../../services/category.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { environment } from 'src/environments/environment'
import { DomSanitizer } from '@angular/platform-browser'
import { IproductResponse } from '../../../interfaces/Product.interface'
import { Product } from '../../../models/Product.models'
import { Categoria } from '../../../models/Category.models'
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips'
import { ChipsAddEvent, ChipsRemoveEvent } from 'primeng/chips'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ProductListView } from '../../../views/product-list/product-list.view'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { ConfirmationService, MessageService } from 'primeng/api'

@Component({
  selector: 'app-create-product-component',
  templateUrl: './create-product-component.component.html',
  styleUrls: ['./create-product-component.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class CreateProductComponentComponent implements OnInit {
  isEditing: boolean = false
  @Input() product!: Product
  categories: Categoria[] = []
  separatorKeysCodes: number[] = [COMMA, ENTER]
  // productImages: any[] = []
  // productImages: Array<{ url: string, file: File }> = []; // Para almacenar imágenes y sus archivos
  productImages: Array<{ url: string, file: File | null }> = [];

  selectedImages: any[] = []
  loading: boolean = false

  productForm!: FormGroup
  idproducEDIT: string = ''

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
    private productListView: ProductListView,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private dialogRef: DynamicDialogRef,
    private messageService: MessageService,  private config: DynamicDialogConfig // Añadir este parámetro

  ) {
    this.product = this.config.data.product; // Obtener el producto de los datos del diálogo
    // console.log(this.product)

    this.loadCategories()
  }
  ngOnInit(): void {
    this.productForm = this.createProductForm()
    if (this.product) {
      console.log(this.product)
      this.isEditing = true
      this.initializeFormWithProductData(this.product)
    } else {
      console.warn('No se han proporcionado datos del producto.')
    }
  }
  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      unit: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      maker: ['', Validators.required],
      nutritionalInformation: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      isFeatured: [false],
      isVegetarian: [false],
      isGlutenFree: [false],
      model: ['', Validators.required],
      ingredients: new FormControl<string[] | null>(null),
      allergens: new FormControl<string[] | null>(null),
      status: [false],
      category: ['', Validators.required],
      images: [null], // Asegúrate de que este campo esté en el formulario si se necesita
    })
  }

  initializeFormWithProductData(product: Product): void {
    if (!product) {
      console.warn('No se han proporcionado datos del producto.');
      return;
    }
    this.idproducEDIT = product._id;
    std:Boolean
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      description: product.description,
      unit: product.unit,
      price: product.price,
      quantity: product.quantity,
      maker: product.maker,
      nutritionalInformation: product.nutritionalInformation,
      weight: product.weight,
      isFeatured: product.isFeatured,
      isVegetarian: product.isVegetarian,
      isGlutenFree: product.isGlutenFree,
      model: product.model,
      category: product.category,
      ingredients:product.ingredients || [],
      allergens:product.allergens || [],
      status: this.checarsta(product.status) , // Asigna 'true' si el estado es 'ACTIVE', de lo contrario 'false'
    });
    this.loadProductImages(product.images || []);

  }
  checarsta(status: string): boolean {
    switch (status) {
      case 'ACTIVE':
          return true;
      case 'INACTIVE':
          return false;
      case 'true':
          return true;
      case 'false':
          return false;
      default:
          return false; // O cualquier otro valor que desees utilizar para los casos no manejados
  }
  }
  setFormArray(arrayName: string, items: string[]): void {
    const formArray = this.productForm.get(arrayName) as FormArray;
    items.forEach((item) => formArray.push(this.fb.control(item)));
  }
  loadProductImages(images: string[]): void {
    this.productImages = images.map((url) => ({ url, file: null }));
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: Categoria[]) => {
        this.categories = data
      },
      (error) => {
        console.error('Error al cargar las categorías:', error)
      },
    )
  }
  // removeExistingImage(index: number): void {
  //   this.product.images.splice(index, 1);
  // }
  EDITARProducto() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      const category = productData.category; // Asegúrate de que esto se ajusta según tu modelo de datos
      this.ngxService.start();
      console.log('Datos del producto:', productData);
  
      // Combina las imágenes existentes y las nuevas imágenes
      const existingImages = this.product.images || [];
      const imageFiles = this.productImages
        .map((img) => img.file)
        .filter((file): file is File => file !== null);
  
      if (imageFiles.length > 0) {
        // Si hay nuevas imágenes, súbelas
        this.productService.uploadImages(category, imageFiles).subscribe(
          (imageData: string[] | { images: string[] }) => {
            imageData = Array.isArray(imageData) ? imageData : imageData.images;
            console.log('Datos de las imágenes subidas:', imageData);
            // Combina las imágenes nuevas con las imágenes existentes, y elimina las imágenes eliminadas
            const updatedImages = this.getUpdatedImages(existingImages, imageData);
            productData.images = updatedImages;
            this.updateProduct(productData);
          },
          (error) => {
            this.ngxService.stop();
            this.messageService.add({
              severity: 'error',
              summary: 'Rechazado',
              detail: 'Error subiendo imágenes',
            });
          }
        );
      } else {
        // Si no hay nuevas imágenes, solo actualiza las imágenes existentes
        productData.images = existingImages;
        this.updateProduct(productData);
      }
    } else {
      console.error('Formulario no válido.');
      this.messageService.add({
        severity: 'error',
        summary: 'Rechazado',
        detail: 'Formulario no válido',
      });
    }
  }
  
  getUpdatedImages(existingImages: string[], newImages: string[]): string[] {
    // Aquí puedes combinar imágenes existentes y nuevas, y eliminar las que fueron eliminadas
    // En este caso, simplemente combinamos las imágenes nuevas con las existentes
    // Implementa lógica adicional si es necesario para eliminar imágenes específicas
    return [...existingImages, ...newImages];
  }
 
  updateProduct(productData: any) {
    this.productService.updateProduct(this.idproducEDIT, productData).subscribe(
      (response) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.productListView.loadProducts();
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Producto actualizado exitosamente',
        });
      },
      (error) => {
        this.ngxService.stop();
        this.messageService.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'Error al actualizar el producto',
        });
      }
    );
  }
  
  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.productImages = []; // Reinicia el array de imágenes
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        // Almacena la URL de la imagen en productImages
        this.productImages.push({ url: e.target.result, file: file });
        this.cdr.markForCheck(); // Para asegurar que Angular detecte los cambios
      };
  
      reader.readAsDataURL(file); // Lee la imagen como una URL de datos
    }
  }
  
  // removeSelectedImage(image: { url: string, file: File | null }): void {
  //   this.productImages = this.productImages.filter(img => img.file !== image.file);
  // }


  removeSelectedImage(image: { url: string; file: File | null }): void {
    const index = this.productImages.indexOf(image);
    if (index >= 0) {
      this.productImages.splice(index, 1);
    }
    if (this.product.images.length > 0) {
      this.product.images.splice(index, 1);
    }
  }

  removeExistingImage(index: number): void {
    this.product.images.splice(index, 1);
  }  
  agregarProducto() {
    if (this.productForm.valid) {
      const productData = this.productForm.value
      const category = productData.category.title // Ajusta según tu modelo de datos
      this.ngxService.start()
      const imageFiles = this.productImages
      .map(img => img.file)
      .filter((file): file is File => file !== null);
      this.productService.uploadImages(category, imageFiles).subscribe(
      // this.productService.uploadImages(category, imageFiles).subscribe(
        (imageData: string[] | { images: string[] }) => {
          imageData = Array.isArray(imageData) ? imageData : imageData.images
          console.log(imageData)
          productData.images = imageData // Asocia las URLs de las imágenes al producto
          this.productService.createProduct(productData).subscribe(
            (response) => {
          
              this.ngxService.stop()
              this.dialogRef.close()
              this.productListView.loadProducts()
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: 'Producto agregado exitosamente',
              })
            },
            (error) => {
              this.ngxService.stop()

              this.messageService.add({
                severity: 'error',
                summary: 'Rechazado',
                detail: 'Error al agregar el producto',
              })
            },
          )
        },
        (error) => {
          this.ngxService.stop()

          this.messageService.add({
            severity: 'error',
            summary: 'Rechazado',
            detail: 'Error subiendo imágenes',
          })
        },
      )
    } else {
      console.error('Formulario no válido.')

      this.messageService.add({
        severity: 'error',
        summary: 'Rechazado',
        detail: 'Formulario no válido',
      })
    }
    // this.messageService.clear();

  }

  getImages(url: string): string {
    return `${environment.api}/${url}`
  }
  removeImage(index: number) {
    this.product.images.splice(index, 1)
  }
}
