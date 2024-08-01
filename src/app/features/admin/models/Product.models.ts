import { environment } from 'src/environments/environment';
import { IproductResponse } from '../interfaces/Product.interface';

export class Product {
  // [x: string]: any;
  _id: string;
  sku: string;
  name: string;
  description: string;
  unit: string;
  expiration: string;
  model: string;
  quantity: number;
  price: number;
  category: string;
  maker: string;
  images: string[];
  status: string;
  weight: number;
  ingredients: string[];
  allergens: string[];
  nutritionalInformation: string;
  isFeatured: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;

  constructor(data?: IproductResponse) {
    this._id = data?._id ? data._id : '';
    this.sku = data?.sku ? data.sku : '';
    this.name = data?.name ? data.name : '';
    this.description = data?.description ? data.description : '';
    this.unit = data?.unit ? data.unit : '';
    this.expiration = data?.expiration ? data.expiration : '';
    this.model = data?.model ? data.model : '';
    this.quantity = data?.quantity ? data.quantity : 0;
    this.price = data?.price ? data.price : 0;
    this.category = data?.category ? data.category : '';
    this.maker = data?.maker ? data.maker : '';
    this.images = data?.images ? data.images : [];
    this.status = data?.status ? data.status : '';
    this.weight = data?.weight ? data.weight : 0;
    this.ingredients = data?.ingredients ? data.ingredients : [];
    this.allergens = data?.allergens ? data.allergens : [];
    this.nutritionalInformation = data?.nutritionalInformation ? data.nutritionalInformation : '';
    this.isFeatured = data?.isFeatured ? data.isFeatured : false;
    this.isVegetarian = data?.isVegetarian ? data.isVegetarian : false;
    this.isGlutenFree = data?.isGlutenFree ? data.isGlutenFree : false;
  }

}

