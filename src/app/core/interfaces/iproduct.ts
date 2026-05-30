export interface IProduct {
  id:  number;
  name:  string;
  metalType:  string;
  weight:  number;
  buyPrice: number;
  sellPrice: number;
  status:   string;
  stock:   number;
  imageUrl: string;
  categoryName: string;
  popularityScore: number;
  createdAt:  string;
}

export interface IProductDetails {
  id:  number;
  name: string;
  metalType: string;   
  purity:  number;
  weight:  number;
  buyPrice:  number;
  sellPrice: number;
  status:  string;   
  stock: number;
  imageUrl: string;
  categoryName: string;
}