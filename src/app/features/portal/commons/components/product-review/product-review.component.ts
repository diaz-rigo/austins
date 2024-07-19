import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ReviewService } from '../review.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent  {
  // @Input() productId!: number;
  // reviews: any[] = [];
  // reviewForm: FormGroup;

  // constructor(private reviewService: ReviewService, private fb: FormBuilder) {
  //   this.reviewForm = this.fb.group({
  //     author: ['', Validators.required],
  //     comment: ['', Validators.required],
  //     rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]]
  //   });
  // }

  // ngOnInit() {
  //   this.reviews = this.reviewService.getReviews(this.productId);
  // }

  // addReview() {
  //   if (this.reviewForm.valid) {
  //     const newReview = {
  //       productId: this.productId,
  //       ...this.reviewForm.value
  //     };
  //     this.reviewService.addReview(newReview);
  //     this.reviews = this.reviewService.getReviews(this.productId);
  //     this.reviewForm.reset();
  //   }
  // }
}
