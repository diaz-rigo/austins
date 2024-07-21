import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/core/services/session.service';
import { ReviewService } from 'src/app/features/admin/commons/services/review.service';
import { UserProfile } from 'src/app/shared/models/userPROFILE.model';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ProductReviewComponent implements OnInit {
  @Input() productId!: string;
  reviews: any[] = [];
  showForm = false;
  user: UserProfile | undefined;

  averageRating: number = 0;
  totalReviews: number = 0;
  formGroup: FormGroup;
  ratingDistribution: { stars: number; count: number }[] = [];

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      value: [null],
      name: [''],
      email: [''],
      comment: ['']
    });
    const userData = this.sessionService.getUserData();
    if (userData) {
      this.traedatosuser_session(userData.id);
    }
  }

  traedatosuser_session(userId: string) {
    this.profileService.getUserById(userId).subscribe(
      (data: UserProfile) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  ngOnInit() {
    this.getProductReviews();

  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  getColor(name: string): string {
    const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFA07A', '#20B2AA'];
    const charCode = name.charCodeAt(0);
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
  }

  getProductReviews() {
    this.reviewService.getProductReviews(this.productId).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.reviews.forEach(review => {
          this.fetchUserData(review.userId._id, review);
        });
        this.calculateStatistics();
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  fetchUserData(userId: string, review: any) {
    this.profileService.getUserById(userId).subscribe(
      (data) => {
        review.userDetails = data;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
  onSubmit() {
    if (this.formGroup.valid) {
      const reviewData = {
        productId: this.productId,
        userId: this.user?._id, // Este campo se puede actualizar según el usuario logueado
        name: this.formGroup.value.name,
        email: this.formGroup.value.email,
        comment: this.formGroup.value.comment,
        rating: this.formGroup.value.value
      };

      this.reviewService.addReview(reviewData).subscribe(
        response => {
          // this.reviews.push(response.reseña); // Cambiado 'response.review' a 'response.reseña' para coincidir con el servidor
          this.showForm = false;
          this.formGroup.reset();
          this.getProductReviews()
        },
        error => {
          // Manejo de errores
          if (error.status === 404) {
            alert('El usuario con el correo proporcionado no está registrado en nuestra tienda.');
          } else if (error.status === 500) {
            alert('Ocurrió un error al agregar la reseña. Por favor, inténtelo de nuevo más tarde.');
          } else {
            alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
          }
          console.error('Error al agregar la reseña:', error);
        }
      );
    }
  }


  isSubmitDisabled(): boolean {
    const rating = this.formGroup.get('value')?.value;
    return rating === 0 || rating === null;
  }

  calculateStatistics(): void {
    console.log(this.reviews)
    const total = this.reviews.length;

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / total;
    this.totalReviews = total;

    // const distribution = [1, 2, 3, 4, 5].map(stars => ({
    const distribution = [5,4,3,2,1].map(stars => ({
      stars,
      count: this.reviews.filter(review => review.rating === stars).length
    }));
    this.ratingDistribution = distribution;
  }
}
