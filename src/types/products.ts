interface ProductColor {
  name: string;
  value: string;
  url: string;
  Media: string[];
  updateDate: string;
  rank: number;
}

interface Category {
  PK: number;
  Name: string;
  NameAr: string;
  Code: string;
  LabelColorCode: string;
  IsLabel: boolean;
  IsActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  arName: string;
  description?: string;
  arDescription: string;
  price: string;
  finalPrice: string;
  Media: string[];
  updateDate: string;
  rank: number;
  label?: string;
  colors: ProductColor[];
  Category1?: Category | null;
  Category2?: Category | null;
  Category3?: Category | null;
  Category4?: Category | null;
}
