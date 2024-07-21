import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'primeng/carousel';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';

const MATERIAL_PRIME_MODULES = [
  DividerModule,
  RatingModule,
  ConfirmPopupModule,
  CardModule,
  SplitterModule,
  ButtonModule,
  SkeletonModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  CarouselModule,
  InputTextModule,
  InputNumberModule,
  AvatarModule,
  AvatarGroupModule
];

@NgModule({
  imports: [CommonModule, ...MATERIAL_PRIME_MODULES],
  exports: MATERIAL_PRIME_MODULES,
})
export class MaterialModule {}
