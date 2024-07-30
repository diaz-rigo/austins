import { Product } from '../../../models/Product.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IproductResponse } from '../../../interfaces/Product.interface';
import { CategoryService } from '../../services/category.service';
import { Categoria } from '../../../models/Category.models';
@Component({
  selector: 'app-create-product-component',
  templateUrl: './create-product-component.component.html',
  styleUrls: ['./create-product-component.component.scss'],
})
export class CreateProductComponentComponent {
  createForm: FormGroup;
  loading = false;
  separatorKeysCodes = [ENTER, COMMA] as const;
  chips: any[] = [];

  product: Product = {
    _id: '',
    sku: '',
    name: '',
    description: '',
    unit: '',
    expiration: '',
    model: '',
    quantity: 0,
    price: 0,
    category: '',
    maker: '',
    nutritionalInformation: '',
    weight: 0,
    isFeatured: false,
    isVegetarian: false,
    isGlutenFree: false,
    ingredients: [],
    allergens: [],
    status: '',
    images: [],
  };

  selectedImages: any[] = []; // Asegúrate de tener la definición correcta para 'selectedImages'
  productImages: any[] = []; // Asegúrate de tener la definición correcta para 'productImages'
  categories: Categoria[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateProductComponentComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router,
    private el: ElementRef
  ) {
    this.product.ingredients = this.product.ingredients || [];
    this.product.allergens = this.product.allergens || [];

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      unit: ['', Validators.required],
      expiration: ['', Validators.required],
      model: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      maker: ['', Validators.required],
      nutritionalInformation: ['', Validators.required],
      weight: ['', Validators.required],
      isFeatured: [false],
      isVegetarian: [false],
      isGlutenFree: [false],
      ingredients: this.fb.array(this.product.ingredients || []),
      allergens: this.fb.array(this.product.allergens || []),
      status: [false],
    });
    this.loadCategories();
    this.createForm.addControl('ingredientsInput', this.fb.control(''));
    this.createForm.addControl('allergensInput', this.fb.control(''));
  }

  createProduct(): void {
    if (this.createForm.valid) {
      // Evitar múltiples clics mientras está en progreso
      if (this.loading) {
        return;
      }

      this.loading = true;
      const newProduct: Product = {
        name: this.createForm.value.name,
        description: this.createForm.value.description,
        unit: this.createForm.value.unit,
        expiration: this.createForm.value.expiration,
        model: this.createForm.value.model,
        quantity: this.createForm.value.quantity,
        price: this.createForm.value.price,
        category: this.createForm.value.category,
        maker: this.createForm.value.maker,
        images: [],
        status: this.createForm.value.status ? 'ACTIVE' : 'INACTIVE',
        weight: this.createForm.value.weight,
        ingredients: this.getIngredientsArray(),
        allergens: this.getAllergensArray(),
        nutritionalInformation: this.createForm.value.nutritionalInformation,
        isFeatured: this.createForm.value.isFeatured,
        isVegetarian: this.createForm.value.isVegetarian,
        isGlutenFree: this.createForm.value.isGlutenFree,
        _id: '',
        sku: this.createForm.value.sku,
      };
      this.uploadImagesAndAddToForm(newProduct);
    } else {
    }
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const imageFiles = Array.from(input.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length > 0) {
      this.selectedImages = imageFiles;
      this.updateImagePreview();
    } else {
      console.warn('No se seleccionaron imágenes válidas.');
    }
  }

  private updateImagePreview(): void {
    this.productImages = this.selectedImages.map((image: File) => ({
      name: image.name,
      url: URL.createObjectURL(image),
    }));
  }

  private uploadImagesAndAddToForm(product: Product): void {
    this.productService.createProduct(product).subscribe(
      (result: IproductResponse) => {
        // console.log('Producto creado con éxito. ID:', result._id);
        const uploadObservables = this.selectedImages.map((image: File) => {
          const position = product.images.length; // Ajustar la posición según tu lógica
          // console.log(
          //   'creando.. ',
          //   product.category,
          //   result._id,
          //   position,
          //   image
          // );
          return this.productService.updateProductImage(
            product.category,
            result._id,
            position,
            image
          );
        });

        forkJoin(uploadObservables).subscribe(
          (imageURLs: any) => {
            product.images = product.images.concat(imageURLs);
            this.createForm.get('images')?.setValue(product.images);
            this.dialogRef.close(product);
            // this.createProductAfterImagesUpload(product);
            this.loading = false;
          },
          (error) => {
            console.error('Error uploading images:', error);
            this.loading = false;
          }
        );

        this.snackBar.open('Producto creado con éxito', 'Cerrar', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Error al crear el producto', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al crear el producto', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  removeImage(index: number): void {
    const fullImagePath = this.product.images[index];
    const imageNameToRemove = fullImagePath.split('/').pop(); // Extracts the file name from the full path
    if (!imageNameToRemove) {
      console.error('Error: Image name is undefined');
      return;
    }
    this.product.images.splice(index, 1); // Remove the image from the product's array of images

    // Call the productService's deleteImage method to delete the image on the server
    this.productService
      .deleteProductImage(this.product._id, imageNameToRemove)
      .subscribe(
        (response) => {
          // console.log('Image deleted successfully:', response);
          this.showSuccessSnackBar('Image deleted successfully');
          // You can perform other actions after deletion if necessary
          // this.updateProduct(this.product); // Update the product after deleting the image
        },
        (error) => {
          console.error('Error deleting the image:', error);
        }
      );
  }
  showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos
      panelClass: ['snackbar-success'], // Clases CSS adicionales para el estilo
    });
  }

  /////////////funciones adicionales
  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: Categoria[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  removeSelectedImage(selectedImage: File): void {
    const index = this.selectedImages.indexOf(selectedImage);
    if (index !== -1) {
      this.selectedImages.splice(index, 1);
    }
  }

  getImages(url: string): string {
    return `${environment.api}/${url}`;
  }
  getIngredientsArray(): string[] {
    const ingredientsControl = this.createForm.get('ingredients');
    return ingredientsControl ? ingredientsControl.value : [];
  }
  getAllergensArray(): string[] {
    const allergensControl = this.createForm.get('allergens');
    return allergensControl ? allergensControl.value : [];
  }
  getIngredientsInputValue(): string {
    const ingredientsInputControl = this.createForm.get('ingredientsInput');
    return ingredientsInputControl ? ingredientsInputControl.value : '';
  }
  getAllergensInputValue(): string {
    const allergensInputControl = this.createForm.get('allergensInput');
    return allergensInputControl ? allergensInputControl.value : '';
  }
  agregarIngrediente() {
    const ingredientsArray = this.createForm.get('ingredients') as FormArray;
    ingredientsArray.push(this.fb.control('Nuevo ingrediente'));
    console.log('Ingrediente agregado:', this.createForm.value.ingredients);
  }
  addChip(event: MatChipInputEvent, controlName: string): void {
    const value = (event.value || '').trim();
    if (value) {
      const control = this.createForm.get(controlName) as FormArray;
      control.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }
  removeIngredient(index: number) {
    const ingredientsArray = this.createForm.get('ingredients') as FormArray;
    ingredientsArray.removeAt(index);
    // console.log('Ingrediente eliminado:', this.createForm.value.ingredients);
  }
  removeAllergen(index: number) {
    const allergensArray = this.createForm.get('allergens') as FormArray;
    allergensArray.removeAt(index);
  }
  removeChip(index: number, type: string) {
    const formArray = type === 'ingredients' ? 'ingredients' : 'allergens';
    (this.createForm.get(formArray) as FormArray).removeAt(index);
  }
  toggleStatus(): void {
    const statusControl = this.createForm.get('status');
    if (statusControl) {
      const currentStatus = statusControl.value;
      statusControl.setValue(!currentStatus); // Cambiar el valor del checkbox
    }
  }
  editIngredient(index: number, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeIngredient(index);
      return;
    }
    const ingredientsArray = this.createForm.get('ingredients') as FormArray;
    ingredientsArray.at(index).setValue(value);
  }
  editAllergens(index: number, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      // Remove ingredient if it no longer has a name
      this.removeAllergen(index);
      return;
    }

    const AllergensArray = this.createForm.get('allergens') as FormArray;
    AllergensArray.at(index).setValue(value);
  }
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
