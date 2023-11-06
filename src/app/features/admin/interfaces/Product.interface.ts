// export interface IproductResponse
// {
//  images:string[];
//  _id:string;
//  sku:string;
//  name:string;
//  description:string;
//  unit:string;
//  expiration:string;
//  model:string;
//  quantity:string;
//  price:number;
//  category:string;
//  status:string;
// }

export interface IproductResponse
{
  _id: string;
  sku: string;
  name: string;
  description: string;
  unit: string;
  expiration: string;
  model: string;
  quantity: string;
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
}

