export interface Category {
  PK: number;
  Name: string;
  NameAr: string;
  Code: string;
  LabelColorCode: string | null;
  IsLabel: boolean;
  IsActive: boolean;
}

export type GetAllCategoriesResponse = Category[];
